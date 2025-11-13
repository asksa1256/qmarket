import { supabase } from "../../../shared/api/supabase-client";
import { Item } from "../model/types";
import {
  ITEMS_TABLE_NAME,
  SELECT_ITEM_COLUMNS,
  ITEMS_PAGE_SIZE,
} from "../../../shared/config/constants";

/**
 * 특정 offset부터 PAGE_SIZE만큼 상품을 가져오는 함수
 * @param offset 데이터 시작 위치 (0, 10, 20, ...)
 */
export const fetchItemsPage = async (offset: number): Promise<Item[]> => {
  const from = offset;
  const to = offset + ITEMS_PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from(ITEMS_TABLE_NAME)
    .select(SELECT_ITEM_COLUMNS)
    .order("id", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("페이지 데이터 로딩 오류:", error);
    throw new Error("상품 데이터를 불러오는 데 실패했습니다.");
  }

  return data as Item[];
};
