import { useMemo } from "react";
import { getItemPriceChangesSummary } from "../../model/getItemPriceChangesSummary";
import { ItemPriceChange } from "../../model/itemPriceChangeTypes";

export default function ItemPriceChangesSummary({
  items,
}: {
  items: ItemPriceChange[];
}) {
  const summary = useMemo(() => getItemPriceChangesSummary({ items }), [items]);

  if (!summary) return null;

  return (
    <section className="mt-4 border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">🔮 시세 변동 요약</h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">변동 아이템 (신규, 유지 포함)</p>
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
              ? `${summary.maxUp.item_name}(${summary.maxUp.item_gender}) +${summary.maxUp.change_rate}%`
              : "-"}
          </p>
          <span className="text-foreground/50">
            {summary.maxUp?.prev_price.toLocaleString()} →{" "}
            <b className="text-foreground">
              {summary.maxUp?.cur_price.toLocaleString()}
            </b>
          </span>
        </div>

        <div>
          <p className="text-gray-500">최대 하락</p>
          <p className="text-blue-600 font-medium">
            {summary.maxDown
              ? `${summary.maxDown.item_name}(${summary.maxDown.item_gender}) ${summary.maxDown.change_rate}%`
              : "-"}
          </p>
          <span className="text-foreground/50">
            {summary.maxDown?.prev_price.toLocaleString()} →{" "}
            <b className="text-foreground">
              {summary.maxDown?.cur_price.toLocaleString()}
            </b>
          </span>
        </div>
      </div>
    </section>
  );
}
