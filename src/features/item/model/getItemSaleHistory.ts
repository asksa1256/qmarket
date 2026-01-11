import { supabase } from "@/shared/api/supabase-client";
import { Transaction } from "@/features/market/model/transactionTypes";
import { formatKST } from "@/shared/lib/formatters";

export interface SaleHistory {
  date: string;
  avgPrice: number;
  total_sales: number;
  transactions: Transaction[];
}

interface ItemRow {
  item_name: string;
  price: number;
  updated_at: string;
  is_sold?: boolean;
}

interface DailySaleHistoryRow {
  sale_date: string;
  avg_price: number;
  total_sales: number;
}

/**
 * 아이템 판매 완료 내역 일별 조회 함수
 */
export default async function getItemSaleHistory(
  itemName: string,
  itemGender: string
): Promise<SaleHistory[]> {
  if (!itemName || itemName.trim().length === 0) {
    return [];
  }

  // 1. RPC 함수 호출 (일별 집계 데이터)
  const [rpcResult, detailResult] = await Promise.all([
    supabase.rpc("get_daily_sale_history", {
      item_name_input: itemName,
      item_gender_input: itemGender,
    }),
    // 2. 상세 거래 내역 전체 쿼리 (별도의 쿼리)
    supabase
      .from("items")
      .select("item_name, price, updated_at")
      .eq("item_name", itemName)
      .eq("item_gender", itemGender)
      .eq("is_sold", true) // 판매 완료된 내역만 필터링
      .order("updated_at", { ascending: false }),
  ]);

  const { data: rpcData, error: rpcError } = rpcResult;
  const { data: detailData, error: detailError } = detailResult;

  if (rpcError || detailError) {
    console.error("판매 내역 조회 중 오류:", rpcError || detailError);
    return [];
  }

  if (!rpcData || rpcData.length === 0) {
    return [];
  }

  // 3. 상세 내역을 날짜별로 그룹핑
  const transactionsByDate: { [date: string]: Transaction[] } = {};
  if (detailData) {
    detailData.forEach((row: ItemRow) => {
      const saleDate = formatKST(row.updated_at).slice(0, 10); //transaction date 그룹핑 형식(yyyy-mm-dd)을 맞추기 위해 'hh:mm' 부분은 제거

      const transaction: Transaction = {
        item_name: row.item_name,
        price: row.price,
        updated_at: row.updated_at,
      };

      if (!transactionsByDate[saleDate]) {
        transactionsByDate[saleDate] = [];
      }
      transactionsByDate[saleDate].push(transaction);
    });
  }

  // 4. RPC 결과(집계)와 상세 내역 병합
  const historyData: SaleHistory[] = rpcData.map((row: DailySaleHistoryRow) => {
    const date = row.sale_date;
    return {
      date: date,
      avgPrice: Number(row.avg_price),
      transactions: transactionsByDate[date] || [], // 상세 내역 배열 추가
    };
  });

  return historyData;
}
