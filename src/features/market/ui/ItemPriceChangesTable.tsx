"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { addWeeks, format, getWeekOfMonth } from "date-fns";
import { getItemPriceChanges } from "../model/getItemPriceChanges";
import { formatRelativeTime } from "@/shared/lib/formatters";
import {
  getWeekStart,
  getWeekRange,
  formatDateYMD,
} from "@/shared/lib/formatters";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export default function ItemPriceChangesTable({ limit }: { limit?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week");

  /** 기준 주 시작일 (월요일) 설정 */
  const weekStart = useMemo(() => {
    const parsed = weekParam ? new Date(weekParam) : null;
    if (!parsed || isNaN(parsed.getTime())) {
      return getWeekStart(new Date());
    }
    return getWeekStart(parsed);
  }, [weekParam]);

  const { start, end } = getWeekRange(weekStart);
  const today = new Date().toISOString().split("T")[0];

  // 이번주 기준 설정 (다음주 방지)
  const currentWeekStart = getWeekStart(new Date());
  const isNextDisabled = weekStart >= currentWeekStart;

  const {
    data: priceChanges = [],
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["itemPriceChanges", formatDateYMD(start)],
    queryFn: () =>
      getItemPriceChanges({
        limit,
        startDate: start,
        endDate: end,
      }),
  });

  const moveWeek = (date: Date) => {
    router.replace(`?week=${formatDateYMD(date)}`);
  };

  return (
    <>
      {/* 테이블 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => moveWeek(addWeeks(weekStart, -1))}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft /> 지난주
        </Button>

        <div className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg bg-gray-50 border">
          <span className="text-sm text-foreground/80 font-bold">
            {format(start, "MM")}월 {getWeekOfMonth(start)}주차
          </span>

          <span className="text-xs text-foreground/50">
            {format(start, "yyyy.MM.dd")} ~ {format(end, "MM.dd")}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          disabled={isNextDisabled}
          className={cn("flex items-center gap-1", {
            "text-gray-300 border-gray-200 cursor-not-allowed": isNextDisabled,
            "text-gray-600 hover:bg-gray-50": !isNextDisabled,
          })}
          onClick={() => moveWeek(addWeeks(weekStart, 1))}
        >
          다음주 <ChevronRight />
        </Button>
      </div>

      <div className="w-full h-[480px] px-4 pb-4 border rounded-lg overflow-y-auto bg-background">
        {isPending ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="text-sm text-gray-500">
                <th className="sticky top-0 z-1 bg-background px-2 py-3 font-medium">
                  아이템
                </th>
                <th className="sticky top-0 z-1 bg-background px-2 py-3 font-medium">
                  현재 시세
                </th>
                <th className="sticky top-0 z-1 bg-background px-2 py-3 font-medium">
                  이전 시세
                </th>
                <th className="sticky top-0 z-1 bg-background px-2 py-3 font-medium text-center">
                  변동률
                </th>
                <th className="sticky top-0 z-1 bg-background px-2 py-3 font-medium text-right">
                  최근 거래일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 min-h-[300px]">
              {priceChanges.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <span className="text-sm font-medium">
                        해당 기간의 시세 변동 내역이 없습니다.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              {priceChanges.length > 0 &&
                priceChanges.map((item) => {
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
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
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
                      <td className="py-3 px-2 font-semibold text-gray-900">
                        {item.cur_price.toLocaleString("ko-KR")}
                      </td>

                      {/* 직전 시세 */}
                      <td className="py-3 px-2 text-gray-500">
                        {item.prev_price
                          ? Math.floor(item.prev_price).toLocaleString("ko-KR")
                          : "-"}
                      </td>

                      {/* 변동률 & 비교 기준 */}
                      <td className="py-3 px-2 text-center">
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
                      <td className="py-3 px-2 text-right text-sm text-gray-400">
                        {formatRelativeTime(item.log_date)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
      {/* 캐싱 데이터 유지 + 갱신 */}
      {!isPending && isFetching && (
        <div className="text-xs text-gray-400 text-center py-2">
          데이터 업데이트 중…
        </div>
      )}
    </>
  );
}
