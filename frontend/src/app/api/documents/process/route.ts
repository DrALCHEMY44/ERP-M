import { NextResponse } from "next/server"
import { z } from "zod"
import { authorizeRequest } from "@/lib/server/firebase-token"
import { processStoredDocument } from "@/lib/server/document-intelligence"

export const runtime = "nodejs"
export const maxDuration = 300

const schema = z.object({
  documentId: z.string().min(1).max(200),
  fileUrl: z.string().min(1),
  filename: z.string().min(1).max(250),
})

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    const input = schema.parse(await request.json())
    const parsedUrl = new URL(input.fileUrl, new URL(request.url).origin)
    const objectKey = parsedUrl.searchParams.get("key") || ""
    const allowedPrefix = `documents/${profile.tenantId}/${profile.businessId}/`
    if (!objectKey.startsWith(allowedPrefix)) {
      return NextResponse.json({ error: "Cross-company document processing denied" }, { status: 403 })
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
    return NextResponse.json({ error: error instanceof Error ? error.message : "Document processing failed" }, { status: 500 })
  }
}
