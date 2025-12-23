"use server";

import { supabaseServer } from "@/shared/api/supabase-server";
import {
  checkUserEntryLimit,
  incrementUserEntryCount,
} from "@/shared/api/redis";
import { getUserServer } from "@/shared/api/get-supabase-user-server";

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

    // 참가 횟수 체크
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
