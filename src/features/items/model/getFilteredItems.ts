import { supabase } from "@/shared/api/supabase-client";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";

interface Props {
  userId: string;
  isForSale: boolean;
  isSold: boolean;
}

const getFilteredItems = async ({ userId, isForSale, isSold }: Props) => {
  // let query = supabase.from(ITEMS_TABLE_NAME).select("*").eq("user_id", userId);
  let query = supabase.from("items_test").select("*").eq("user_id", userId);

  // 삽니다/팝니다 구분
  query = query.eq("is_for_sale", isForSale);

  // 거래 완료 여부 구분
  query = query.eq("is_sold", isSold);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("아이템 목록 로딩 오류:", error);
    throw new Error(error.message);
  }
  return data;
};

export default getFilteredItems;
