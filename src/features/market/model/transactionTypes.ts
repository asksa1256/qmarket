// 차트 데이터 포인트 타입 (일별 거래 내역)
interface ChartDataPoint {
  date: string; // 거래일자
  total_sales: number; // 일별 거래 시세
  transactions: Transaction[]; // 상세 거래 내역
}

export interface Transaction {
  item_name: string;
  price: number;
  updated_at: string;
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
}
