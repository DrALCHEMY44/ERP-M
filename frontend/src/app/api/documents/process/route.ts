import { NextResponse } from "next/server"
import { z } from "zod"

import { authorizeRequest } from "@/lib/server/auth"
import { hasPermission } from "@/lib/server/authorization"
import { processStoredDocument } from "@/lib/server/document-intelligence"
import { db } from "@/lib/server/neon"

export const runtime = "nodejs"
export const maxDuration = 300

const schema = z.object({
  documentId: z.string().min(1).max(200),
  fileUrl: z.string().min(1),
  filename: z.string().min(1).max(250),
})

export async function POST(request: Request) {
  let profile
  try {
    profile = await authorizeRequest(request)
  } catch {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }
  if (!hasPermission(profile, "documents:write")) {
    return NextResponse.json(
      { error: "Document processing is not available for your role" },
      { status: 403 },
    )
  }

  let requestBody: unknown
  try {
    requestBody = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request" }, { status: 400 })
  }
  const validation = schema.safeParse(requestBody)
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid document processing request" },
      { status: 400 },
    )
  }

  const input = validation.data
  const parsedUrl = new URL(input.fileUrl, new URL(request.url).origin)
  const objectKey = parsedUrl.searchParams.get("key") || ""
  const allowedPrefix = `documents/${profile.tenantId}/${profile.businessId}/`
  if (!objectKey.startsWith(allowedPrefix)) {
    return NextResponse.json(
      { error: "Cross-company document processing denied" },
      { status: 403 },
    )
  }

  try {
    const records = await db()`SELECT file_url FROM documents
      WHERE id=${input.documentId} AND tenant_id=${profile.tenantId}
        AND business_id=${profile.businessId} LIMIT 1`
    if (!records.length) {
      return NextResponse.json({ error: "Document was not found" }, { status: 404 })
    }
    const registeredUrl = new URL(String(records[0].file_url), new URL(request.url).origin)
    if (registeredUrl.searchParams.get("key") !== objectKey) {
      return NextResponse.json(
        { error: "Document storage binding does not match" },
        { status: 403 },
      )
    }

    const result = await processStoredDocument({
      documentId: input.documentId,
      tenantId: profile.tenantId,
      businessId: profile.businessId,
      objectKey,
      filename: input.filename,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Document processing failed", error)
    return NextResponse.json({ error: "Document processing failed" }, { status: 500 })
  }
}
