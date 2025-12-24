"use server";

import { supabaseServer } from "@/shared/api/supabase-server";
import {
  checkUserEntryLimit,
  incrementUserEntryCount,
  restoreEntryCount,
} from "@/shared/api/redis";
import { getUserServer } from "@/shared/api/get-supabase-user-server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 참가 등록
export async function registerBestDresser(
  imageUrl: string,
  description: string
) {
  try {
    const user = await getUserServer();

    if (!user) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    const limitCheck = await checkUserEntryLimit(user.id);

    if (!limitCheck.canEnter) {
      return {
        success: false,
        error: "참가 횟수를 초과했습니다. (최대 3회)",
        currentCount: limitCheck.currentCount,
      };
    }

    const { error: insertError } = await supabaseServer
      .from("best_dresser")
      .insert({
        image_url: imageUrl,
        user_id: user.id,
        nickname: user.user_metadata.custom_claims?.global_name,
        votes: 0,
        description: description,
      });

    if (insertError) {
      throw insertError;
    }

    // redis 카운트 증가
    await incrementUserEntryCount(user.id);

    return {
      success: true,
      remainingCount: limitCheck.remainingCount - 1,
    };
  } catch (error) {
    console.error("등록 오류:", error);
    return {
      success: false,
      error: "등록 중 오류가 발생했습니다.",
    };
  }
}

// 참가 등록 횟수 카운트
export async function getRemainingEntryCount() {
  try {
    const user = await getUserServer();

    if (!user) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    const limitCheck = await checkUserEntryLimit(user.id);

    return {
      success: true,
      currentCount: limitCheck.currentCount,
      remainingCount: limitCheck.remainingCount,
      canEnter: limitCheck.canEnter,
    };
  } catch (error) {
    console.error("조회 오류:", error);
    return {
      success: false,
      error: "조회 중 오류가 발생했습니다.",
    };
  }
}

// 게시글 삭제 시 s3 이미지도 삭제
export async function deleteS3Image(imageUrl: string) {
  try {
    // s3 이미지 경로 추출
    const url = new URL(imageUrl);
    // pathname은 "/folder/filename.png" 형태이므로 앞의 "/"를 제거
    const fileKey = decodeURIComponent(url.pathname.substring(1));

    if (!fileKey) {
      return { success: false, error: "파일 키를 추출할 수 없습니다." };
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
    });

    await s3Client.send(command);

    return { success: true };
  } catch (error) {
    console.error("s3 삭제 에러:", error);
    return { success: false, error: "이미지 삭제에 실패했습니다." };
  }
}

// 게시글 삭제 시 참가 횟수 복원
export async function restoreEntryCountAction(userId: string) {
  if (!userId) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  return await restoreEntryCount(userId);
}
