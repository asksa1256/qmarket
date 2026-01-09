"use server";

import { getSupabaseClientCookie } from "@/shared/api/supabase-cookie";
import {
  checkAndIncrementDailyItemLimit,
  DAILY_LIMIT,
  rollbackDailyItemLimit,
} from "@/shared/api/redis";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";

export async function createDirectPriceAction(values: {
  item_name: string;
  image: string;
  item_gender: string;
  item_source: string;
  category: string;
  price: number;
  is_sold: boolean;
  is_for_sale: boolean;
  transaction_image: string;
  message: string;
}) {
  const supabase = await getSupabaseClientCookie();

  // 서버에서 현재 로그인한 유저 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "인증되지 않은 사용자입니다." };
  }

  // 일일 등록 제한 확인 및 차감
  const currentCount = await checkAndIncrementDailyItemLimit(user.id);

  if (currentCount > DAILY_LIMIT) {
    return {
      success: false,
      error: "일일 등록 횟수를 모두 사용했습니다.",
    };
  }

  const { data, error } = await supabase
    .from(ITEMS_TABLE_NAME)
    .insert([
      {
        ...values,
        user_id: user.id, // 서버에서 user_id 추가
        nickname:
          user.user_metadata?.custom_claims?.global_name ??
          user.user_metadata?.full_name,
        discord_id: user.user_metadata?.full_name,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("시세 등록 실패:", error);
    await rollbackDailyItemLimit(user.id);
    return { success: false, error: "시세 등록에 실패했습니다." };
  }

  return { success: true, data };
}
