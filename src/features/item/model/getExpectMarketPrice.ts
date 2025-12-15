"use server";

import { ITEMS_TABLE_NAME } from "@/shared/config/constants";
import { supabaseServer } from "@/shared/api/supabase-server";

// 예상 호가 조회 함수 (서버 데이터)
export const getExpectMarketPrice = async (
  itemName: string,
  itemGender: string
): Promise<number | undefined> => {
  if (!itemName || itemName.trim().length === 0) return;

  const { data: result, error } = await supabaseServer
    .from(ITEMS_TABLE_NAME)
    .select("expect_price")
    .eq("item_name", itemName)
    .eq("item_gender", itemGender)
    .eq("nickname", "관리자")
    .limit(1); // single() 사용하면 관리자 데이터 없을 시 fetch 오류 발생

  if (!result || result.length === 0) {
    return undefined;
  }

  return result[0].expect_price;
};
