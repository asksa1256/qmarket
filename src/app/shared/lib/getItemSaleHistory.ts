import { supabase } from "../api/supabase-client";

export interface SaleHistory {
  date: string; // 'YYYY-MM-DD'
  avgPrice: number;
}

/**
 * 아이템 판매 완료 내역 일별 조회 함수 (Supabase RPC 사용)
 */
export default async function getItemSaleHistory(
  itemName: string
): Promise<SaleHistory[]> {
  if (!itemName || itemName.trim().length === 0) {
    return [];
  }

  // 1. RPC 함수 호출
  // PostgREST는 DB 함수 호출 시, 매개변수 이름을 함수의 매개변수 이름(item_name_input)과 맞춰서 JSON 객체로 보냅니다.
  const { data, error } = await supabase.rpc("get_daily_sale_history", {
    item_name_input: itemName,
  });

  if (error) {
    console.error("판매 내역 조회 중 오류 (RPC):", error);
    // 실제 운영 환경에서는 에러 로깅 후 빈 배열 반환
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // 2. 응답 데이터 SaleHistory 인터페이스에 맞게 포맷 및 반환
  // DB 함수의 결과 컬럼명은 sale_date와 avg_price입니다.
  const historyData: SaleHistory[] = data.map((row: any) => ({
    date: row.sale_date, // 'YYYY-MM-DD' 형식의 문자열
    avgPrice: Number(row.avg_price), // NUMERIC을 number로 변환
  }));

  return historyData;
}
