"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // 체크섬 관련 파라미터가 URL에 붙는 것을 방지
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export async function getUploadUrl(fileName: string, fileType: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const key = `uploads/${Date.now()}-${fileName}`; // 파일명 중복 방지

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    ChecksumAlgorithm: undefined,
  });

  // 60초 동안 유효한 업로드 URL 생성
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60,
  });

  return {
    signedUrl,
    fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${command.input.Key}`,
  };
}
