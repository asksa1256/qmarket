import { supabase } from "@/shared/api/supabase-client";

export const updateItemToSold = async (itemId: string) => {
  const { data, error } = await supabase
    .from("items_test")
    .update({ is_sold: true })
    .eq("id", itemId)
    .select();
  // .single();

  if (error) {
    console.error("아이템 판매 완료 업데이트 오류:", error);
    throw new Error(error.message);
  }
  return data;
};
