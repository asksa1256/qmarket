import { supabase } from "@/shared/api/supabase-client";
import { addWeeks } from "date-fns";
import { formatDateYMD } from "@/shared/lib/formatters";

export async function getItemPriceChanges({
  limit,
  startDate,
}: {
  limit?: number;
  startDate: Date;
}) {
  const nextWeekStart = addWeeks(startDate, 1);

  // KST 날짜 문자열을 만들고, 이를 UTC timestamp로 변환 (서버 저장 형식은 UTC로 통일하기 위함)
  const startKST = `${formatDateYMD(startDate)}T00:00:00+09:00`;
  const endKST = `${formatDateYMD(nextWeekStart)}T00:00:00+09:00`;

  let query = supabase
    .from("item_price_changes")
    .select(
      `
      *,
      items_info ( image )
    `
    )
    .gte("log_date", startKST)
    .lt("log_date", endKST)
    .order("log_date", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return [];

  return data.map(({ items_info, cur_price, prev_price, ...rest }) => ({
    cur_price: Math.round(cur_price),
    prev_price: Math.round(prev_price),
    image: items_info?.image ?? null,
    ...rest,
  }));
}
