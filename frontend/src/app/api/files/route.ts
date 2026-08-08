import { randomUUID } from "crypto"
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { authorizeRequest } from "@/lib/server/firebase-token"
import { objectStorage, storageBucket } from "@/lib/server/object-storage"

export const runtime = "nodejs"
const MAX_FILE_SIZE = 25 * 1024 * 1024

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-160) || "file"
}

function allowedKey(key: string, profile: { tenantId: string; businessId: string }) {
  return key.startsWith(`documents/${profile.tenantId}/${profile.businessId}/`)
}

function uploadErrorResponse(error: unknown) {
  const candidate = error as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } }
  const name = candidate?.name || ""
  const status = candidate?.$metadata?.httpStatusCode
  if (name.includes("Credentials") || status === 401 || status === 403) {
    return NextResponse.json({ error: "Object Storage credentials do not have permission to upload to this bucket." }, { status: 503 })
  }
  if (name === "NoSuchBucket" || status === 404) {
    return NextResponse.json({ error: "The configured Object Storage bucket was not found." }, { status: 503 })
  }
  if (candidate?.message?.includes("not fully configured") || candidate?.message?.includes("S3_BUCKET")) {
    return NextResponse.json({ error: "Object Storage is not fully configured on the server." }, { status: 503 })
  }
  return NextResponse.json({ error: "The storage service could not accept this file. Please retry." }, { status: 502 })
}

export async function POST(request: Request) {
  let profile
  try {
    try {
      profile = await authorizeRequest(request)
    } catch (error) {
      console.warn("Object upload authentication rejected", error instanceof Error ? error.message : error)
      return NextResponse.json({ error: "Your session is missing or expired. Please sign in again." }, { status: 401 })
    }
    const form = await request.formData()
    const file = form.get("file")
    if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File must be between 1 byte and 25 MB" }, { status: 400 })
    }

    const key = `documents/${profile.tenantId}/${profile.businessId}/${profile.uid}/${randomUUID()}_${safeFilename(file.name)}`
    await objectStorage().send(new PutObjectCommand({
      Bucket: storageBucket(),
      Key: key,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type || "application/octet-stream",
      Metadata: {
        tenantid: profile.tenantId,
        businessid: profile.businessId,
        uploadedby: profile.uid,
        originalname: encodeURIComponent(file.name).slice(0, 1000),
      },
    }))
    return NextResponse.json({
      objectKey: key,
      fileUrl: `/api/files?key=${encodeURIComponent(key)}`,
    })
  } catch (error) {
    console.error("Object upload failed", error)
    return uploadErrorResponse(error)
  }
}

export async function GET(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    const key = new URL(request.url).searchParams.get("key") ?? ""
    if (!allowedKey(key, profile)) return NextResponse.json({ error: "File access denied" }, { status: 403 })
    const object = await objectStorage().send(new GetObjectCommand({ Bucket: storageBucket(), Key: key }))
    const body = object.Body?.transformToWebStream()
    if (!body) return NextResponse.json({ error: "File not found" }, { status: 404 })
    return new NextResponse(body, {
      headers: {
        "Content-Type": object.ContentType || "application/octet-stream",
        ...(object.ContentLength ? { "Content-Length": String(object.ContentLength) } : {}),
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    console.error("Object download failed", error)
    return NextResponse.json({ error: "Object download failed" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    const key = new URL(request.url).searchParams.get("key") ?? ""
    if (!allowedKey(key, profile)) return NextResponse.json({ error: "File access denied" }, { status: 403 })
    await objectStorage().send(new DeleteObjectCommand({ Bucket: storageBucket(), Key: key }))
    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error("Object deletion failed", error)
    return NextResponse.json({ error: "Object deletion failed" }, { status: 500 })
  }
}
