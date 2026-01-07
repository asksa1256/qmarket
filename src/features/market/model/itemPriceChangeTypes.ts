export interface ItemPriceChange {
  id: number;
  item_name: string;
  item_gender: string;
  log_date: string; // 일별 집계용 로그 날짜
  updated_at: string; // 실제 시세 변동이 발생한 시점
  change_rate: number;
  prev_price: number;
  cur_price: number;
  image: string | null;
  days_since_last_sale: number;
}

export type ChangeRateSortOrder = "default" | "desc" | "asc";
