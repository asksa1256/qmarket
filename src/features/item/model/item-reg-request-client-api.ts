import { supabase } from "@/shared/api/supabase-client";

export async function createItemRequest({
  itemName,
  gender,
  userId,
}: {
  itemName: string;
  gender: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("item_reg_request")
    .insert({
      item_name: itemName,
      item_gender: gender,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkExistingRequest({
  itemName,
  gender,
}: {
  itemName: string;
  gender: string;
}) {
  const { data, error } = await supabase
    .from("item_reg_request")
    .select("id")
    .eq("item_name", itemName)
    .eq("item_gender", gender);

  if (error) {
    console.error("아이템 요청 목록 확인 중 에러 발생:", error);
    throw new Error("아이템 요청 목록 확인 실패");
  }

  return data && data.length > 0;
}
