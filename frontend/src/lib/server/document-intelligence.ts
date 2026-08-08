import { GetObjectCommand } from "@aws-sdk/client-s3"
import mammoth from "mammoth"
import * as XLSX from "xlsx"
import { objectStorage, storageBucket } from "./object-storage"
import { createEmbeddings, createQueryEmbedding, freeCompletion } from "./openrouter"
import { ensureMirrorSchema } from "./neon"
import { neon } from "@neondatabase/serverless"

function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured")
  return neon(process.env.DATABASE_URL)
}

function chunks(text: string, size = 1200, overlap = 200) {
  const clean = text.replace(/\0/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim()
  const output: string[] = []
  for (let start = 0; start < clean.length; start += size - overlap) {
    output.push(clean.slice(start, start + size))
    if (start + size >= clean.length) break
  }
  return output.slice(0, 250)
}

async function aiExtract(buffer: Buffer, mimeType: string, filename: string) {
  const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`
  const contentPart = mimeType === "application/pdf"
    ? { type: "file", file: { filename, file_data: dataUrl } }
    : { type: "image_url", image_url: { url: dataUrl } }
  return freeCompletion({
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Extract all readable text from this business document. Preserve tables in markdown. Do not summarize or invent values." },
        contentPart,
      ],
    }],
    plugins: mimeType === "application/pdf"
      ? [{ id: "file-parser", pdf: { engine: "cloudflare-ai" } }]
      : undefined,
    maxTokens: 8000,
  })
}

async function extractText(buffer: Buffer, mimeType: string, filename: string) {
  if (mimeType.startsWith("text/") || ["application/json", "text/csv"].includes(mimeType)) {
    return { content: buffer.toString("utf8"), model: "local-text" }
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer })
    return { content: result.value, model: "local-mammoth" }
  }
  if (["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(mimeType)) {
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const content = workbook.SheetNames.map((name) => `# ${name}\n${XLSX.utils.sheet_to_csv(workbook.Sheets[name])}`).join("\n\n")
    return { content, model: "local-xlsx" }
  }
  if (mimeType === "application/pdf" || mimeType.startsWith("image/")) {
    return aiExtract(buffer, mimeType, filename)
  }
  throw new Error(`Unsupported document type: ${mimeType}`)
}

function parseJsonObject(value: string) {
  const stripped = value.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim()
  try { return JSON.parse(stripped) } catch { return {} }
}

export async function processStoredDocument(input: {
  documentId: string
  tenantId: string
  businessId: string
  objectKey: string
  filename: string
}) {
  await ensureMirrorSchema()
  const sql = db()
  const object = await objectStorage().send(new GetObjectCommand({ Bucket: storageBucket(), Key: input.objectKey }))
  const bytes = await object.Body?.transformToByteArray()
  if (!bytes) throw new Error("Stored document is empty")
  const mimeType = object.ContentType || "application/octet-stream"

  await sql`INSERT INTO document_intelligence(document_id,tenant_id,business_id,object_key,mime_type,file_size,status)
    VALUES(${input.documentId},${input.tenantId},${input.businessId},${input.objectKey},${mimeType},${Number(object.ContentLength || bytes.length)},'PROCESSING')
    ON CONFLICT(document_id) DO UPDATE SET status='PROCESSING',error_message=NULL`
  try {
    const extracted = await extractText(Buffer.from(bytes), mimeType, input.filename)
    if (!extracted.content.trim()) throw new Error("No readable text was extracted")
    const analysis = await freeCompletion({
      messages: [{ role: "user", content: `Analyze this ERP document. Return only JSON with keys classification, summary, invoiceNumber, supplier, customer, invoiceDate, dueDate, currency, subtotal, tax, total, paymentStatus, anomalies. Use null for unknown values.\n\n${extracted.content.slice(0, 30000)}` }],
      maxTokens: 1500,
    }).catch(() => ({ content: "{}", model: extracted.model }))
    const structured = parseJsonObject(analysis.content)
    const summary = typeof structured.summary === "string" ? structured.summary : extracted.content.slice(0, 500)
    const classification = typeof structured.classification === "string" ? structured.classification : "Document"
    const parts = chunks(extracted.content)
    const vectors = await createEmbeddings(parts)

    await sql`DELETE FROM document_chunks WHERE document_id=${input.documentId}`
    for (let index = 0; index < parts.length; index++) {
      const vector = vectors?.[index] ? `[${vectors[index].join(",")}]` : null
      await sql.query(
        `INSERT INTO document_chunks(document_id,tenant_id,business_id,chunk_index,content,embedding)
         VALUES($1,$2,$3,$4,$5,$6::vector)`,
        [input.documentId,input.tenantId,input.businessId,index,parts[index],vector],
      )
    }
    await sql`UPDATE document_intelligence SET status='READY',raw_text=${extracted.content},summary=${summary},
      classification=${classification},structured_data=${JSON.stringify(structured)}::jsonb,processing_model=${analysis.model},
      processed_at=NOW(),error_message=NULL WHERE document_id=${input.documentId}`
    return { status: "READY", classification, summary, chunks: parts.length, structured }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await sql`UPDATE document_intelligence SET status='FAILED',error_message=${message},processed_at=NOW() WHERE document_id=${input.documentId}`
    throw error
  }
}

export async function searchDocuments(input: { tenantId: string; businessId: string; query: string; limit?: number }) {
  const sql = db()
  const limit = Math.min(Math.max(input.limit || 6, 1), 12)
  const queryVector = await createQueryEmbedding(input.query)
  if (queryVector) {
    const vector = `[${queryVector.join(",")}]`
    return sql.query(
      `SELECT c.document_id,c.chunk_index,c.content,d.summary,d.classification,n.title,1-(c.embedding <=> $1::vector) AS score
       FROM document_chunks c JOIN document_intelligence d ON d.document_id=c.document_id JOIN documents n ON n.id=c.document_id
       WHERE c.tenant_id=$2 AND c.business_id=$3 AND c.embedding IS NOT NULL AND d.status='READY'
       ORDER BY c.embedding <=> $1::vector LIMIT $4`,
      [vector,input.tenantId,input.businessId,limit],
    )
  }
  return sql.query(
    `SELECT c.document_id,c.chunk_index,c.content,d.summary,d.classification,n.title,
       ts_rank(to_tsvector('simple',c.content),websearch_to_tsquery('simple',$1)) AS score
     FROM document_chunks c JOIN document_intelligence d ON d.document_id=c.document_id JOIN documents n ON n.id=c.document_id
     WHERE c.tenant_id=$2 AND c.business_id=$3 AND d.status='READY'
       AND to_tsvector('simple',c.content) @@ websearch_to_tsquery('simple',$1)
     ORDER BY score DESC LIMIT $4`,
    [input.query,input.tenantId,input.businessId,limit],
  )
}
