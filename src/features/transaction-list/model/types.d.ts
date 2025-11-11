interface Transaction {
  item_name: string;
  price: number;
  updated_at: string;
}

// 차트 데이터 포인트 타입 (일별 거래 내역)
interface ChartDataPoint {
  date: string; // 거래 내역 차트 label
  total_sales: number; // 일별 판매 평균가
  transactions: Transaction[]; // 상세 거래 내역
}

interface TooltipPayloadItem {
  payload: ChartDataPoint;
  name?: string;
  value?: number;
  dataKey?: string;
  unit?: string;
}

export interface TransactionListProps {
  payload: TooltipPayloadItem[];
  label: string; // X축 값 (날짜)
}
