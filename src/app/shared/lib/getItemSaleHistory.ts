import { supabase } from "../api/supabase-client";

export interface SaleHistory {
  date: string; // 'YYYY-MM-DD'
  avgPrice: number;
}

/**
 * 아이템 판매 완료 내역 일별 조회 함수
 */
export default async function getItemSaleHistory(
  itemName: string
): Promise<SaleHistory[]> {
  // 실제 Supabase 쿼리 로직은 복잡하므로, 여기서는 시간순 정렬된 더미 데이터를 반환합니다.
  // 실제 쿼리: items 테이블에서 'item_name'으로 필터링, 'is_sold'가 true인 레코드를
  // 'sold_date'별로 그룹화하여 'price'의 평균을 계산하는 복잡한 쿼리가 필요합니다.

  return [
    { date: "2025-09-25", avgPrice: 15000000 },
    { date: "2025-09-26", avgPrice: 15500000 },
    { date: "2025-09-27", avgPrice: 14800000 },
    { date: "2025-09-28", avgPrice: 16000000 },
    { date: "2025-09-29", avgPrice: 15200000 },
    { date: "2025-09-30", avgPrice: 15700000 },
    { date: "2025-10-01", avgPrice: 16300000 },
  ];

  // 판매 내역 없을 경우
  // return [];
}
