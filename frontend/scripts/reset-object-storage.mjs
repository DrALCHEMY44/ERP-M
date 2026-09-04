import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  ListObjectVersionsCommand,
  S3Client,
} from "@aws-sdk/client-s3"

const REQUIRED_CONFIRMATION = "RESET_ALL_SMARTERP_OBJECTS"
const bucket = process.env.S3_BUCKET

if (!bucket || !process.env.AWS_ENDPOINT_URL_S3 || !process.env.AWS_REGION
  || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("Private object storage is not fully configured")
}

const client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function listCurrentObjects() {
  const objects = []
  let continuationToken
  do {
    const result = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: continuationToken,
    }))
    objects.push(...(result.Contents ?? []).flatMap((item) => item.Key
      ? [{ Key: item.Key, Size: Number(item.Size ?? 0) }]
      : []))
    continuationToken = result.IsTruncated ? result.NextContinuationToken : undefined
  } while (continuationToken)
  return objects
}

async function listVersionedObjects() {
  const objects = []
  let keyMarker
  let versionIdMarker
  do {
    const result = await client.send(new ListObjectVersionsCommand({
      Bucket: bucket,
      KeyMarker: keyMarker,
      VersionIdMarker: versionIdMarker,
    }))
    objects.push(...(result.Versions ?? []).flatMap((item) => item.Key && item.VersionId
      ? [{ Key: item.Key, VersionId: item.VersionId, Size: Number(item.Size ?? 0) }]
      : []))
    objects.push(...(result.DeleteMarkers ?? []).flatMap((item) => item.Key && item.VersionId
      ? [{ Key: item.Key, VersionId: item.VersionId, Size: 0 }]
      : []))
    keyMarker = result.IsTruncated ? result.NextKeyMarker : undefined
    versionIdMarker = result.IsTruncated ? result.NextVersionIdMarker : undefined
  } while (keyMarker)
  return objects
}

async function inventory() {
  const current = await listCurrentObjects()
  try {
    const versioned = await listVersionedObjects()
    return { targets: versioned.length ? versioned : current, versionListingSupported: true, current }
  } catch (error) {
    const status = error?.$metadata?.httpStatusCode
    if (![400, 404, 405, 501].includes(status)) throw error
    return { targets: current, versionListingSupported: false, current }
  }
}

async function deleteTargets(targets) {
  for (let offset = 0; offset < targets.length; offset += 1000) {
    const batch = targets.slice(offset, offset + 1000)
    const result = await client.send(new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Quiet: true,
        Objects: batch.map(({ Key, VersionId }) => ({ Key, VersionId })),
      },
    }))
    if (result.Errors?.length) {
      throw new Error(`Object reset failed for ${result.Errors.length} item(s)`)
    }
  }
}

const before = await inventory()
console.log(JSON.stringify({
  objects: before.current.length,
  storedVersionsAndMarkers: before.targets.length,
  bytes: before.targets.reduce((total, item) => total + item.Size, 0),
  versionListingSupported: before.versionListingSupported,
  mode: process.env.RESET_OBJECT_STORAGE_CONFIRMATION === REQUIRED_CONFIRMATION ? "execute" : "preview",
}, null, 2))

if (process.env.RESET_OBJECT_STORAGE_CONFIRMATION !== REQUIRED_CONFIRMATION) {
  console.log(`No objects changed. Set RESET_OBJECT_STORAGE_CONFIRMATION=${REQUIRED_CONFIRMATION} to execute.`)
  process.exitCode = 2
} else {
  await deleteTargets(before.targets)
  const after = await inventory()
  if (after.current.length || after.targets.length) {
    throw new Error(`Object reset verification failed: ${after.targets.length} item(s) remain`)
  }
  console.log(JSON.stringify({ resetComplete: true, objectsRemaining: 0 }, null, 2))
}
