"use server";

import { revalidateTag } from "next/cache";
import { supabaseServer } from "@/shared/api/supabase-server";

export async function createItemRequestAction({
  itemName,
  gender,
  userId,
}: {
  itemName: string;
  gender: string;
  userId: string;
}) {
  // 중복 체크
  const { data: existing } = await supabaseServer
    .from("item_reg_request")
    .select("id")
    .eq("item_name", itemName)
    .eq("item_gender", gender);

  if (existing && existing.length > 0) {
    throw new Error("이미 등록 요청된 아이템입니다.");
  }

  // 등록
  const { data, error } = await supabaseServer
    .from("item_reg_request")
    .insert({
      item_name: itemName,
      item_gender: gender,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error("아이템 등록 요청에 실패했습니다.");
  }

  // 아이템 요청 목록 갱신
  revalidateTag("item-reg-requests");

  return data;
}
