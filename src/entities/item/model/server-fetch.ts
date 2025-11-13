import { supabaseServer } from "../../../shared/api/supabase-server";
import { Item } from "../model/types";
import {
  ITEMS_TABLE_NAME,
  SELECT_ITEM_COLUMNS,
} from "../../../shared/config/constants";

/**
 * 서버에서 초기 상품 목록 10개를 가져오는 함수
 * @param limit 가져올 데이터 수 (기본값 10)
 * @param offset 시작 위치 (페이지네이션/무한 스크롤용)
 */
export const fetchInitialItems = async (
  limit: number = 10,
  offset: number = 0
): Promise<Item[]> => {
  const { data, error } = await supabaseServer
    .from(ITEMS_TABLE_NAME)
    .select(SELECT_ITEM_COLUMNS)
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("서버 초기 데이터 로딩 오류:", error);
    throw new Error(error.message);
  }

  return data as Item[];
};
