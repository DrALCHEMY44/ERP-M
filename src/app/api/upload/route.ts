import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to the public/uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    
    // Create the directory if it doesn't exist
    await mkdir(uploadsDir, { recursive: true })

    // Clean filename of unsafe characters
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${Date.now()}_${safeName}`
    const filePath = path.join(uploadsDir, filename)
    
    await writeFile(filePath, buffer)

    console.log(`Uploaded file saved locally at: ${filePath}`)

    // Return a URL that goes through the download API route (Next.js dev server
    // doesn't serve files added to public/ at runtime without a restart)
    const fileUrl = `/api/download?file=${encodeURIComponent(filename)}`
    return NextResponse.json({ fileUrl, filename })
  } catch (error: any) {
    console.error("Local file upload error:", error)
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 })
  }
}
