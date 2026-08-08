import { S3Client } from "@aws-sdk/client-s3"

let client: S3Client | null = null

export function objectStorage() {
  if (client) return client
  const endpoint = process.env.AWS_ENDPOINT_URL_S3
  const region = process.env.AWS_REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    throw new Error("Neon Object Storage is not fully configured")
  }
  client = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  })
  return client
}

export function storageBucket() {
  const bucket = process.env.S3_BUCKET
  if (!bucket) throw new Error("S3_BUCKET is not configured")
  return bucket
}
