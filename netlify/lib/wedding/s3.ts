import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { URL_EXPIRY_SECONDS, loadR2Config } from "./config.js";

let cached: { client: S3Client; bucket: string } | undefined;

function ctx(): { client: S3Client; bucket: string } {
  if (!cached) {
    const cfg = loadR2Config();
    cached = {
      bucket: cfg.bucket,
      client: new S3Client({
        region: "auto",
        endpoint: cfg.endpoint,
        forcePathStyle: cfg.forcePathStyle,
        credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
        // R2 does not support the SDK's default CRC32 checksums on presigned requests.
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED",
      }),
    };
  }
  return cached;
}

export function getS3(): S3Client {
  return ctx().client;
}

export function bucketName(): string {
  return ctx().bucket;
}

export function presignGet(
  key: string,
  opts: { disposition?: string; contentType?: string } = {},
): Promise<string> {
  const { client, bucket } = ctx();
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: opts.disposition ?? "inline",
      ...(opts.contentType ? { ResponseContentType: opts.contentType } : {}),
    }),
    { expiresIn: URL_EXPIRY_SECONDS },
  );
}

export function presignUploadPart(key: string, uploadId: string, partNumber: number): Promise<string> {
  const { client, bucket } = ctx();
  return getSignedUrl(
    client,
    new UploadPartCommand({ Bucket: bucket, Key: key, UploadId: uploadId, PartNumber: partNumber }),
    { expiresIn: URL_EXPIRY_SECONDS },
  );
}

export function presignPut(key: string, contentType: string): Promise<string> {
  const { client, bucket } = ctx();
  return getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: URL_EXPIRY_SECONDS },
  );
}

export async function getText(key: string): Promise<string | null> {
  const { client, bucket } = ctx();
  try {
    const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    return (await res.Body?.transformToString()) ?? null;
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export async function putJson(key: string, value: unknown): Promise<void> {
  const { client, bucket } = ctx();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(value),
      ContentType: "application/json",
    }),
  );
}

function errName(e: unknown): string {
  return e instanceof Error ? e.name : "";
}

export function isNotFound(e: unknown): boolean {
  const name = errName(e);
  if (name === "NoSuchKey" || name === "NotFound") return true;
  const status = (e as { $metadata?: { httpStatusCode?: number } } | null)?.$metadata?.httpStatusCode;
  return status === 404;
}

export function isNoSuchUpload(e: unknown): boolean {
  return errName(e) === "NoSuchUpload";
}
