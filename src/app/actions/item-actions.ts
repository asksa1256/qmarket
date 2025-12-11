"use server";

import {
  checkAndIncrementDailyItemLimit,
  DAILY_LIMIT,
  getDailyItemCount,
  getRemainingTime,
  restoreDailyItemCount,
} from "@/shared/api/redis";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";
import { getSupabaseClientCookie } from "@/shared/api/supabase-cookie";
import preventCreateExistingItem from "@/features/item/model/preventCreateExistingItem";

interface ItemFormValues {
  id?: number;
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

// 아이템 등록
export async function createItem(values: ItemFormValues) {
  const supabase = await getSupabaseClientCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  // 아이템 중복 등록 방지
  await preventCreateExistingItem({
    itemName: values.item_name,
    itemGender: values.item_gender,
    isForSale: values.is_for_sale,
    userId: user.id,
  });

  const { data, error } = await supabase
    .from(ITEMS_TABLE_NAME)
    .insert([{ ...values, user_id: user.id }])
    .select();

  if (error) throw new Error(error.message);

  // 아이템 등록 잔여 횟수 차감
  const currentCount = await checkAndIncrementDailyItemLimit(user.id);
  const remaining = DAILY_LIMIT - currentCount;

  return { data, remaining };
}

// 아이템 수정
export async function updateItem(values: ItemFormValues) {
  const supabase = await getSupabaseClientCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { id, ...updateData } = values;

  const { data, error } = await supabase
    .from(ITEMS_TABLE_NAME)
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("아이템을 찾을 수 없습니다.");

  return data;
}

// 아이템 일일 등록 가능 횟수 표시 (redis 함수는 서버에서만 사용 가능하므로 서버 액션 함수 별도 생성)
export async function getDailyItemCountAction() {
  const supabase = await getSupabaseClientCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { count: 0, remaining: DAILY_LIMIT };

  const count = await getDailyItemCount(user.id);
  const remaining = Math.max(0, DAILY_LIMIT - count);
  return { count, remaining };
}

export async function getRemainingTimeAction(): Promise<number> {
  const supabase = await getSupabaseClientCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  return await getRemainingTime(user.id);
}

// 아이템 삭제 시 등록 횟수 1회 복구
export async function restoreDailyItemCountAction(userId: string) {
  try {
    await restoreDailyItemCount(userId);
  } catch (error) {
    console.error("Failed to decrease daily count:", error);
    throw new Error("서버에서 횟수 복구 중 오류가 발생했습니다.");
  }
}
