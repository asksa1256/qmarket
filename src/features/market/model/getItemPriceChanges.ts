import { supabase } from "@/shared/api/supabase-client";

export async function getItemPriceChanges({
  limit,
  startDate,
  endDate,
}: {
  limit?: number;
  startDate: Date;
  endDate: Date;
}) {
  let query = supabase
    .from("item_price_changes")
    .select(
      `
      *,
      items_info ( image )
    `
    )
    .neq("change_rate", 0)
    .gte("log_date", startDate.toISOString().slice(0, 10))
    .lte("log_date", endDate.toISOString().slice(0, 10))
    .order("log_date", { ascending: false })
    .order("change_rate", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return [];

  return data.map(({ items_info, ...rest }) => ({
    ...rest,
    image: items_info?.image ?? null,
  }));
}
