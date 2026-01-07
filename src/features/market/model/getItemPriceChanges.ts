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

  let query = supabase
    .from("item_price_changes")
    .select(
      `
      *,
      items_info ( image )
    `
    )
    .neq("change_rate", 0)
    .gte("log_date", formatDateYMD(startDate))
    .lt("log_date", formatDateYMD(nextWeekStart))
    .order("log_date", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return [];

  return data.map(({ items_info, ...rest }) => ({
    ...rest,
    image: items_info?.image ?? null,
  }));
}
