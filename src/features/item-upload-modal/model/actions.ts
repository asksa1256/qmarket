"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  checkAndIncrementDailyItemLimit,
  DAILY_LIMIT,
  getDailyItemCount,
} from "@/shared/lib/redis";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";
import { getRemainingTime } from "@/shared/lib/redis";

interface InsertItemValues {
  item_name: string;
  price: number;
  item_source: string;
  item_gender: string;
  category: string;
  nickname: string;
  discord_id: string;
  user_id: string;
  is_sold: boolean;
}

export async function insertItem(values: InsertItemValues) {
  const supabase = await getSupabaseCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from(ITEMS_TABLE_NAME)
    .insert([{ ...values, user_id: user.id }])
    .select();

  if (error) throw new Error(error.message);

  // 아이템 등록 성공 후 Redis 카운트 증가 (등록 실패 시 횟수 차감 방지)
  const currentCount = await checkAndIncrementDailyItemLimit(user.id);
  const remaining = DAILY_LIMIT - currentCount;

  return { data, currentCount, remaining };
}

// 클라이언트에 일일 등록 카운트 표시해주는 함수
export async function getDailyItemCountAction() {
  const supabase = await getSupabaseCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { count: 0, remaining: DAILY_LIMIT };

  const count = await getDailyItemCount(user.id);
  const remaining = DAILY_LIMIT - count;
  return { count, remaining };
}

// 등록 잔여 횟수, 시간 리턴 함수
export async function getDailyItemInsertStatus(userId: string) {
  const count = await getDailyItemCount(userId);
  const remainingTime = await getRemainingTime(userId); // 초 단위
  return { count, remaining: DAILY_LIMIT - count, remainingTime };
}

async function getSupabaseCookie() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  return supabase;
}
