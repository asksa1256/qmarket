interface Transaction {
  item_name: string;
  price: number;
  updated_at: string;
}

// 해당 날짜의 전체 데이터 포인트 타입 (차트 데이터에 포함됨)
interface ChartDataPoint {
  date: string; // label과 일치
  total_sales: number;
  transactions: Transaction[]; // Custom Tooltip에 필요한 핵심 배열
}

interface TooltipPayloadItem {
  // name, value, unit 등 Recharts가 추가하는 필드들
  // 그러나 우리가 필요한 것은 원본 데이터 객체인 'payload'입니다.
  payload: ChartDataPoint;
  // 기타 필드...
  name?: string;
  value?: number;
  dataKey?: string;
  unit?: string;
}

// TransactionList 컴포넌트의 Props 타입
export interface TransactionListProps {
  // active: boolean; // Custom Tooltip 컴포넌트(부모)에서 확인하므로 여기서는 필요 없을 수 있음
  payload: TooltipPayloadItem[];
  label: string; // X축의 값 (날짜)
}
