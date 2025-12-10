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
  // 중복 아이템 등록 요청 체크
  const { data: existing, error: checkError } = await supabaseServer
    .from("item_reg_request")
    .select("id")
    .eq("item_name", itemName)
    .eq("item_gender", gender);

  if (checkError) {
    console.error("아이템 요청 목록 확인 중 에러 발생:", checkError);
    throw new Error("아이템 요청 목록 확인 실패");
  }

  if (existing && existing.length > 0) {
    throw new Error("해당 아이템은 이미 등록 요청된 상태입니다.");
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

  revalidateTag("item-reg-requests");

  return data;
}
