import Image from "next/image";
import { getItemPriceChanges } from "../model/getItemPriceChanges";
import { formatRelativeTime } from "@/shared/lib/formatters";
import Link from "next/link";

export default async function ItemPriceChangesTable({
  limit,
}: {
  limit?: number;
}) {
  const priceChanges = await getItemPriceChanges(limit);

  // 오늘 날짜 (YYYY-MM-DD, 시간 제외 비교용)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full max-h-[400px] overflow-y-auto">
      <table className="w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr className="border-b border-gray-200 text-sm text-gray-500">
            <th className="sticky top-0 z-1 bg-background shadow-sm p-2 font-medium">
              아이템
            </th>
            <th className="sticky top-0 z-1 bg-background shadow-sm p-2 font-medium">
              현재 시세
            </th>
            <th className="sticky top-0 z-1 bg-background shadow-sm p-2 font-medium">
              이전 시세
            </th>
            <th className="sticky top-0 z-1 bg-background shadow-sm p-2 font-medium text-center">
              변동률
            </th>
            <th className="sticky top-0 z-1 bg-background shadow-sm p-2 font-medium text-right">
              최근 거래일
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {priceChanges.map((item) => {
            const isRising = item.change_rate > 0;
            const isFalling = item.change_rate < 0;

            // 신규 데이터 판별 (log_date가 오늘이고, prev_price가 null이거나 0인 데이터)
            const itemLogDate = new Date(item.log_date)
              .toISOString()
              .split("T")[0];
            const isNewItem =
              itemLogDate === today &&
              (!item.prev_price || item.prev_price === 0);

            return (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {/* 아이템 정보 */}
                <td className="py-1 px-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.image || "/images/empty.png"}
                        alt={item.item_name}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <Link
                      href={`/item/${item.item_name}/${item.item_gender}`}
                      prefetch={false}
                    >
                      <b className="font-bold text-foreground mr-1 hover:underline hover:underline-offset-2 hover:text-blue-500">
                        {item.item_name}
                      </b>
                      <span className="text-xs text-gray-400">
                        ({item.item_gender})
                      </span>
                    </Link>
                  </div>
                </td>

                {/* 최근 시세 */}
                <td className="py-4 px-2 font-semibold text-gray-900">
                  {item.cur_price.toLocaleString("ko-KR")}
                </td>

                {/* 직전 시세 */}
                <td className="py-4 px-2 text-gray-500">
                  {item.prev_price
                    ? Math.floor(item.prev_price).toLocaleString("ko-KR")
                    : "-"}
                </td>

                {/* 변동률 & 비교 기준 */}
                <td className="py-4 px-2 text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        isRising
                          ? "bg-red-50 text-red-600"
                          : isFalling
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span className="text-[10px] mr-0.5">
                        {isRising ? "▲" : isFalling ? "▼" : ""}
                      </span>
                      {Math.abs(Math.floor(item.change_rate))}%
                    </span>

                    <span className="text-xs text-gray-400">
                      {isNewItem
                        ? "(신규)"
                        : item.days_since_last_sale === 0
                        ? ""
                        : `(${item.days_since_last_sale}일 전 대비)`}
                    </span>
                  </div>
                </td>

                {/* 최근 거래일 */}
                <td className="py-4 px-2 text-right text-sm text-gray-400">
                  {formatRelativeTime(item.log_date)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
