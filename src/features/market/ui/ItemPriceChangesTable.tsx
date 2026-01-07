"use client";

import { useMemo, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { addWeeks, format } from "date-fns";
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
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ChevronUpDown from "@/shared/ui/Icon/ChevronUpDown";
import { cn } from "@/shared/lib/utils";
import ItemPriceChangesCards from "./ItemPriceChangesCards";
import { ChangeRateSortOrder } from "../model/itemPriceChangeTypes";
import ItemPriceChangesSummary from "./ItemPriceChangeSummary";

interface Props {
  limit?: number;
  preview?: boolean;
  className?: string;
}

export default function ItemPriceChangesTable({
  limit,
  preview = false,
  className,
}: Props) {
  const [sortOrder, setSortOrder] = useState<ChangeRateSortOrder>("default"); // 변동률 정렬: api 대신 프론트에서 정렬 처리 (supabase api는 음/양수 숫자 정렬용 표현식 order를 지원하지 않음)
  const [filter, setFilter] = useState<"all" | "up" | "down">("all"); // 변동률 전체, 상승, 하락 필터링

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
    queryKey: ["item-price-changes", formatDateYMD(start), sortOrder],
    queryFn: () =>
      getItemPriceChanges({
        limit,
        startDate: start,
      }),
  });

  const moveWeek = (date: Date) => {
    router.replace(`?week=${formatDateYMD(date)}`);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === "default") return "desc";
      if (prev === "desc") return "asc";
      return "default";
    });
  };

  const filteredAndSortedPriceChanges = useMemo(() => {
    let list = [...priceChanges];

    // 상승 / 하락 필터
    if (filter === "up") {
      list = list.filter((item) => item.change_rate > 0);
    }

    if (filter === "down") {
      list = list.filter((item) => item.change_rate < 0);
    }

    // 정렬
    if (sortOrder === "default") {
      // 최근 거래 순
      list.sort(
        (a, b) =>
          new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
      );
    }

    if (sortOrder === "desc") {
      // 절댓값 기준 큰 순
      list.sort((a, b) => Math.abs(b.change_rate) - Math.abs(a.change_rate));
    }

    if (sortOrder === "asc") {
      // 절댓값 기준 작은 순
      list.sort((a, b) => Math.abs(a.change_rate) - Math.abs(b.change_rate));
    }

    return list;
  }, [priceChanges, filter, sortOrder]);

  return (
    <>
      <div className={className}>
        {/* 테이블 헤더 */}
        <div className="flex flex-col items-center">
          <div className="flex w-full items-center justify-between mb-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => moveWeek(addWeeks(weekStart, -1))}
              className={cn("text-sm text-gray-500 hover:text-gray-900", {
                hidden: preview,
              })}
            >
              <ChevronLeft /> 지난주
            </Button>

            <div
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg bg-gray-50 border",
                {
                  "items-start": preview,
                }
              )}
            >
              {/* <span className="text-sm text-foreground/80 font-bold">
              {format(start, "M")}월 {getWeekOfMonth(start)}주차
            </span> */}

              <span className="text-sm text-foreground text-medium">
                {format(start, "yyyy.MM.dd")} ~ {format(end, "MM.dd")}
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              disabled={isNextDisabled}
              className={cn("flex items-center gap-1", {
                "text-gray-300 border-gray-200 cursor-not-allowed":
                  isNextDisabled,
                "text-gray-600 hover:bg-gray-50": !isNextDisabled,
                hidden: preview,
              })}
              onClick={() => moveWeek(addWeeks(weekStart, 1))}
            >
              다음주 <ChevronRight />
            </Button>
          </div>

          {!preview && (
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setFilter("all")}
                className={cn("px-3 py-1 text-xs rounded-full", {
                  "bg-gray-900 text-white": filter === "all",
                  "bg-gray-100 text-gray-600": filter !== "all",
                })}
              >
                변동률 전체
              </button>

              <button
                onClick={() => setFilter("up")}
                className={cn("px-3 py-1 text-xs rounded-full", {
                  "bg-red-500 text-white": filter === "up",
                  "bg-red-50 text-red-500": filter !== "up",
                })}
              >
                상승
              </button>

              <button
                onClick={() => setFilter("down")}
                className={cn("px-3 py-1 text-xs rounded-full", {
                  "bg-blue-500 text-white": filter === "down",
                  "bg-blue-50 text-blue-500": filter !== "down",
                })}
              >
                하락
              </button>
            </div>
          )}
        </div>

        {/* 테이블 본문 (데스크탑) */}
        <div
          className={cn(
            "hidden md:block w-full h-[480px] px-4 pb-4 border rounded-lg overflow-y-auto bg-background",
            {
              "h-[280px]": preview,
            }
          )}
        >
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
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
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="inline-flex items-center gap-1 hover:text-foreground"
                      onClick={toggleSortOrder}
                    >
                      변동률
                      {sortOrder === "default" && (
                        <ChevronUpDown className="w-4 h-4" />
                      )}
                      {sortOrder === "desc" && (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      {sortOrder === "asc" && <ChevronUp className="w-4 h-4" />}
                    </Button>
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
                  filteredAndSortedPriceChanges.map((item) => {
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
                            ? Math.floor(item.prev_price).toLocaleString(
                                "ko-KR"
                              )
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
                        <td className="py-3 px-2 text-right text-gray-400">
                          {formatRelativeTime(item.log_date)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>

        {/* 테이블 본문 (태블릿, 모바일) */}
        <div className="block md:hidden">
          <ItemPriceChangesCards
            items={filteredAndSortedPriceChanges}
            isLoading={isPending}
          />
        </div>

        {/* 캐싱 데이터 유지 + 갱신 */}
        {!isPending && isFetching && (
          <div className="text-xs text-gray-400 text-center py-2">
            데이터 업데이트 중…
          </div>
        )}
      </div>

      {/* 시세 변동 요약 */}
      <ItemPriceChangesSummary items={priceChanges} />
    </>
  );
}
