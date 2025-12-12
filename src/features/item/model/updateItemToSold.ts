import { supabase } from "@/shared/api/supabase-client";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";

export const updateItemToSold = async (
  itemId: number,
  isForSale: boolean,
  transactionImageUrl?: string
) => {
  const { data, error } = await supabase
    .from(ITEMS_TABLE_NAME)
    // .from("items_test")
    .update({ is_sold: true, transaction_image: transactionImageUrl || null })
    .eq("id", itemId)
    .select();

  if (error) {
    console.error(`아이템 ${isForSale} 완료 처리 오류:`, error);
    throw new Error(error.message);
  }

  return { data };
};
