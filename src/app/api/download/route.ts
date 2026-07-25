import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import path from "path"

// Map common extensions to MIME types
const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".csv": "text/csv",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".zip": "application/zip",
  ".json": "application/json",
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  return MIME_TYPES[ext] || "application/octet-stream"
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("file")

    if (!filename) {
      return NextResponse.json({ error: "Missing 'file' parameter" }, { status: 400 })
    }

    // Sanitize: prevent directory traversal
    const safeName = path.basename(filename)
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadsDir, safeName)

    // Ensure the resolved path is inside uploadsDir
    const resolvedPath = path.resolve(filePath)
    if (!resolvedPath.startsWith(path.resolve(uploadsDir))) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 403 })
    }

    // Check file exists
    try {
      await stat(resolvedPath)
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileBuffer = await readFile(resolvedPath)
    const mimeType = getMimeType(safeName)

    // Determine if this should be inline (viewable) or attachment (download)
    const mode = searchParams.get("mode") // "view" or "download"
    const disposition = mode === "download"
      ? `attachment; filename="${safeName}"`
      : `inline; filename="${safeName}"`

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": disposition,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error: any) {
    console.error("File download error:", error)
    return NextResponse.json({ error: error.message || "Failed to serve file" }, { status: 500 })
  }
}
