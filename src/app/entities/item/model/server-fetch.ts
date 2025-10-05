import { supabaseServer } from "@/shared/api/supabase-server";
import { Item } from "../model/types";

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
    .from("items")
    .select(
      `
        id, item_name, price, image, 
        is_online, item_source, nickname, is_sold, user_id, item_gender
    `
    )
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("서버 초기 데이터 로딩 오류:", error);
    throw new Error(error.message);
  }

  return data as Item[];
};
