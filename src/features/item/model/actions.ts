"use server";

import {
  checkAndIncrementDailyItemLimit,
  DAILY_LIMIT,
  getDailyItemCount,
} from "@/shared/api/redis";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";
import { getRemainingTime } from "@/shared/api/redis";
import { getSupabaseClientCookie } from "@/shared/api/supabase-cookie";
import preventCreateExistingItem from "./preventCreateExistingItem";

interface CreateSellingItemValues {
  item_name: string;
  price: number;
  image: string | null;
  item_source: string;
  item_gender: string;
  category: string;
  nickname: string;
  discord_id: string;
  user_id: string;
  is_sold: boolean;
  is_for_sale: boolean;
  message: string;
}

interface CreatePurchaseItemValues {
  item_name: string;
  price: number;
  image: string | null;
  item_source: string;
  item_gender: string;
  category: string;
  nickname: string;
  discord_id: string;
  user_id: string;
  is_sold: boolean;
  is_for_sale: boolean;
  message: string;
}

export async function createSellingItem(values: CreateSellingItemValues) {
  const supabase = await getSupabaseClientCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  // 아이템 중복 등록 방지
  await preventCreateExistingItem({
    itemName: values.item_name,
    userId: user.id,
  });

  // 아이템 등록
  const { data, error } = await supabase
    // .from(ITEMS_TABLE_NAME)
    .from("items_test")
    .insert([{ ...values, user_id: user.id }])
    .select();

  if (error) throw new Error(error.message);

  // 아이템 등록 성공 후 Redis 카운트 증가 (등록 실패 시 횟수 차감 방지)
  // const currentCount = await checkAndIncrementDailyItemLimit(user.id);
  // const remaining = DAILY_LIMIT - currentCount;

  // return { data, currentCount, remaining };
  return { data };
}

export async function createPurchaseItem(values: CreatePurchaseItemValues) {
  const supabase = await getSupabaseClientCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  // 아이템 중복 등록 방지
  await preventCreateExistingItem({
    itemName: values.item_name,
    userId: user.id,
  });

  const { data, error } = await supabase
    // .from(ITEMS_TABLE_NAME)
    .from("items_test")
    .insert([{ ...values, user_id: user.id }])
    .select();

  if (error) throw new Error(error.message);

  return { data };
}

// 클라이언트에 일일 등록 카운트 표시해주는 함수
export async function getDailyItemCountAction() {
  const supabase = await getSupabaseClientCookie();
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
