import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import crypto from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET;

export async function uploadBufferToS3({ buffer, contentType, key }) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export function makeUserImageKey({ userId, role, originalName }) {
  // role: 'photo' | 'background'
  const ext = path.extname(originalName || "").toLowerCase() || ".jpg";
  const hash = crypto.randomBytes(8).toString("hex");
  const y = new Date().getFullYear();
  const m = String(new Date().getMonth() + 1).padStart(2, "0");
  return `users/${userId}/${role}/${y}/${m}/${Date.now()}_${hash}${ext}`;
}
