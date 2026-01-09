import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/shared/lib/formatters";
import { ItemPriceChange } from "../../model/itemPriceChangeTypes";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

export default function ItemPriceChangesCards({
  items,
  isLoading,
}: {
  items: ItemPriceChange[];
  isLoading: boolean;
}) {
  const today = new Date().toISOString().split("T")[0];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center py-20 text-gray-400 text-sm">
        <LoadingSpinner />
        데이터 로드 중...
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        해당 기간의 시세 변동 내역이 없습니다.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
      {items.map((item) => {
        const isRising = item.change_rate > 0;
        const isFalling = item.change_rate < 0;

        // 신규 데이터 판별 (log_date가 오늘이고, prev_price가 null이거나 0인 데이터)
        const itemLogDate = new Date(item.log_date).toISOString().split("T")[0];
        const isNewItem = !item.prev_price || item.prev_price === 0;
        const isTodayChange = !isNewItem && today === itemLogDate;

        return (
          <li
            key={item.id}
            className="border rounded-xl p-3 bg-background shadow-sm"
          >
            {/* 아이템 정보 */}
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-16 bg-gray-50 rounded-lg flex-shrink-0">
                <Image
                  src={item.image || "/images/empty.png"}
                  alt={item.item_name}
                  fill
                  className="object-contain rounded-sm"
                />
              </div>

              <div className="flex-1">
                <Link
                  href={`/item/${item.item_name}/${item.item_gender}`}
                  className="font-bold text-sm text-foreground hover:underline"
                >
                  {item.item_name}
                  <span className="ml-1 text-xs text-gray-400">
                    ({item.item_gender})
                  </span>
                </Link>

                <div className="flex flex-col text-xs text-gray-400 mt-1">
                  <span>최근 거래 · {formatRelativeTime(item.log_date)}</span>
                  <span className="text-xs text-gray-400">
                    비교 기준 ·
                    <span className="ml-1">
                      {isNewItem
                        ? "신규"
                        : isTodayChange
                        ? "당일 변동"
                        : `${item.days_since_last_sale}일 전 대비`}
                    </span>
                  </span>
                </div>
              </div>

              {/* 변동률 */}
              <div className="flex flex-col gap-1 items-center">
                <span className="text-gray-400 text-xs">변동률</span>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold",
                    isRising && "bg-red-50 text-red-600",
                    isFalling && "bg-blue-50 text-blue-600",
                    !isRising && !isFalling && "bg-gray-100 text-gray-600"
                  )}
                >
                  {isRising && "▲"}
                  {isFalling && "▼"}
                  {Math.abs(Math.floor(item.change_rate))}%
                </span>
              </div>
            </div>

            {/* 가격 정보 */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col">
                <span className="text-gray-400">현재 시세</span>
                <span className="font-semibold text-gray-900 text-base">
                  {item.cur_price.toLocaleString("ko-KR")}
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-gray-400">이전 시세</span>
                <span className="text-gray-600 text-base">
                  {item.prev_price
                    ? Math.floor(item.prev_price).toLocaleString("ko-KR")
                    : "-"}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
