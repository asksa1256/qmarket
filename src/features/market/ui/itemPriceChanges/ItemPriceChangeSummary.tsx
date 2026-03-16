import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getItemPriceChangesSummary } from "../../model/getItemPriceChangesSummary";
import { ItemPriceChange } from "../../model/itemPriceChangeTypes";
import { formatDateYMD } from "@/shared/lib/formatters";
import { checkIsAdmin } from "@/app/actions/admin-actions";

const BASE_URL = "https://q-market.kr";

function getWeekOfMonth(date: Date) {
  return Math.ceil(date.getDate() / 7);
}

function buildCopyText({
  weekStart,
  weekEnd,
  summary,
}: {
  weekStart: Date;
  weekEnd: Date;
  summary: NonNullable<ReturnType<typeof getItemPriceChangesSummary>>;
}) {
  const month = weekStart.getMonth() + 1;
  const weekNum = getWeekOfMonth(weekStart);

  const startYear = weekStart.getFullYear();
  const startMonth = String(weekStart.getMonth() + 1).padStart(2, "0");
  const startDay = String(weekStart.getDate()).padStart(2, "0");
  const endMonth = String(weekEnd.getMonth() + 1).padStart(2, "0");
  const endDay = String(weekEnd.getDate()).padStart(2, "0");

  const dateRange = `${startYear}/${startMonth}/${startDay} ~ ${endMonth}/${endDay}`;
  const maintainCount = summary.total - summary.upCount - summary.downCount;

  const maxUpText = summary.maxUp
    ? `• 최대 상승: ${summary.maxUp.item_name}(${summary.maxUp.item_gender}) +${summary.maxUp.change_rate}% (${summary.maxUp.prev_price.toLocaleString()} → ${summary.maxUp.cur_price.toLocaleString()})`
    : `• 최대 상승: -`;

  const maxDownText = summary.maxDown
    ? `• 최대 하락: ${summary.maxDown.item_name}(${summary.maxDown.item_gender}) ${summary.maxDown.change_rate}%\n(${summary.maxDown.prev_price.toLocaleString()} → ${summary.maxDown.cur_price.toLocaleString()})`
    : `• 최대 하락: -`;

  const detailUrl = `${BASE_URL}/item-price-changes?week=${formatDateYMD(weekStart)}`;

  return `[${month}월 ${weekNum}주차 주간 시세 변동 요약] (${dateRange})

• 변동 아이템 수: ${summary.total}
• 상승 / 하락 / 유지(신규): ${summary.upCount} / ${summary.downCount} / ${maintainCount}
${maxUpText}
${maxDownText}

✔ 상세 내역:
${detailUrl}`;
}

export default function ItemPriceChangesSummary({
  items,
  weekStart,
  weekEnd,
}: {
  items: ItemPriceChange[];
  weekStart: Date;
  weekEnd: Date;
}) {
  const summary = useMemo(() => getItemPriceChangesSummary({ items }), [items]);
  const [copied, setCopied] = useState(false);
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: checkIsAdmin,
    staleTime: Infinity,
  });

  if (!summary) return null;

  const handleCopy = async () => {
    const text = buildCopyText({ weekStart, weekEnd, summary });
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-4 border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">🔮 시세 변동 요약</h3>
        {isAdmin && (
          <button
            onClick={handleCopy}
            className="text-xs px-2.5 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-600"
          >
            {copied ? "✔ 복사됨" : "복사"}
          </button>
        )}
      </div>

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
