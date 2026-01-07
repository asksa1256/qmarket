import { useMemo } from "react";
import { getItemPriceChangesSummaryWeekly } from "../model/getItemPriceChangesSummaryWeekly";
import { ItemPriceChange } from "../model/itemPriceChangeTypes";

export default function ItemPriceChangesSummary({
  items,
}: {
  items: ItemPriceChange[];
}) {
  const summary = useMemo(
    () => getItemPriceChangesSummaryWeekly({ items }),
    [items]
  );

  if (!summary) return null;

  return (
    <section className="mt-8 border rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-semibold mb-3">📊 주간 시세 변동 요약</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">변동 아이템</p>
          <p className="font-medium">{summary.total}개</p>
        </div>

        <div>
          <p className="text-gray-500">상승 / 하락</p>
          <p className="font-medium">
            상승 {summary.upCount} · 하락 {summary.downCount}
          </p>
        </div>

        <div>
          <p className="text-gray-500">최대 상승</p>
          <p className="text-red-600 font-medium">
            {summary.maxUp
              ? `${summary.maxUp.item_name} +${summary.maxUp.change_rate}%`
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">최대 하락</p>
          <p className="text-blue-600 font-medium">
            {summary.maxDown
              ? `${summary.maxDown.item_name} ${summary.maxDown.change_rate}%`
              : "-"}
          </p>
        </div>
      </div>
    </section>
  );
}
