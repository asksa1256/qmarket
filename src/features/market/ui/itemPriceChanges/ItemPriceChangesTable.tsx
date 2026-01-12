"use client";

import { useMemo, useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatRelativeTime, formatDateYMD } from "@/shared/lib/formatters";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import ChevronUpDown from "@/shared/ui/Icon/ChevronUpDown";
import { cn } from "@/shared/lib/utils";
import { ChangeRateSortOrder } from "../../model/itemPriceChangeTypes";
import { ItemPriceChange } from "../../model/itemPriceChangeTypes";
import ChangeRateBadge from "../ChangeRateBadge";
import ItemPriceChangesMobileAccordion from "./ItemPriceChangesMobileAccordion";

interface Props {
  items: ItemPriceChange[];
  isLoading: boolean;
  preview?: boolean;
  filter: "all" | "up" | "down";
}

export interface DailyGroup {
  date: string;
  items: ItemPriceChange[];
}

export default function ItemPriceChangesTable({
  items,
  isLoading,
  preview = false,
  filter,
}: Props) {
  const [sortOrder, setSortOrder] = useState<ChangeRateSortOrder>("default");
  const [openDates, setOpenDates] = useState<Set<string>>(new Set()); // 일별 그룹 아코디언 오픈 상태
  const today = new Date().toISOString().split("T")[0];

  const dailyGroups = useMemo<DailyGroup[]>(() => {
    const map = new Map<string, ItemPriceChange[]>();

    items.forEach((item) => {
      const date = item.log_date;
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(item);
    });

    return Array.from(map.entries())
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([date, items]) => ({
        date,
        items,
      }));
  }, [items]);

  // 일별 그룹 아코디언 토글
  const toggleDate = (date: string) => {
    setOpenDates((prev) => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === "default") return "desc";
      if (prev === "desc") return "asc";
      return "default";
    });
  };

  // 필터링, 정렬
  const filteredDailyGroups = useMemo(() => {
    return (
      dailyGroups
        .map(({ date, items }) => {
          // 변동률 전체/상승/하락 필터링
          const filteredItems = items.filter((item) => {
            if (filter === "up") return item.change_rate > 0;
            if (filter === "down") return item.change_rate < 0;
            return true;
          });

          // 정렬: 일별 그룹 내에서만 (전체 주간 데이터 대상으로 하면 날짜 정렬 꼬일 수 있음)
          if (sortOrder === "default") {
            filteredItems.sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            );
          } else if (sortOrder === "desc") {
            filteredItems.sort(
              (a, b) => Math.abs(b.change_rate) - Math.abs(a.change_rate)
            );
          } else if (sortOrder === "asc") {
            filteredItems.sort(
              (a, b) => Math.abs(a.change_rate) - Math.abs(b.change_rate)
            );
          }

          return {
            date,
            items: filteredItems,
          };
        })
        // 아이템 없는 날짜는 일별 그룹 제거
        .filter((group) => group.items.length > 0)
    );
  }, [dailyGroups, filter, sortOrder]);

  return (
    <>
      {/* 테이블 본문 (데스크탑) */}
      <div
        className={cn(
          "hidden md:block w-full h-[480px] px-4 pb-4 border rounded-lg overflow-y-auto bg-background",
          {
            "h-[280px]": preview,
          }
        )}
      >
        {isLoading ? (
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

            <tbody className="divide-y">
              {filteredDailyGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-3 px-4 text-sm text-center text-foreground/50"
                  >
                    해당 기간의 시세 변동 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredDailyGroups.map(({ date, items }) => {
                  const isOpen = openDates.has(date);

                  return (
                    <Fragment key={date}>
                      {/* 일별 아코디언 헤더 */}
                      <tr
                        className="bg-gray-100 cursor-pointer hover:bg-gray-200"
                        onClick={() => toggleDate(date)}
                      >
                        <td colSpan={5} className="py-3 px-4 font-bold">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {formatDateYMD(date)}
                            </div>

                            <span className="text-sm text-gray-600">
                              변동 {items.length}개
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* 해당 날짜 아이템 리스트 */}
                      {isOpen &&
                        items.map((item) => {
                          const itemLogDate = new Date(item.log_date)
                            .toISOString()
                            .split("T")[0];

                          const isNewItem =
                            !item.prev_price || item.prev_price === 0;
                          const isTodayChange =
                            !isNewItem && today === itemLogDate;

                          return (
                            <tr key={item.id} className="text-sm">
                              <td className="py-2 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-14 bg-gray-50 flex-shrink-0">
                                    <Image
                                      src={item.image || "/images/empty.png"}
                                      alt={item.item_name}
                                      fill
                                      loading="lazy"
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

                              <td className="py-2 px-2 font-medium">
                                {item.cur_price.toLocaleString()}
                              </td>

                              <td className="py-2 px-2 font-medium text-foreground/50">
                                {item.prev_price !== 0
                                  ? item.prev_price.toLocaleString()
                                  : "-"}
                              </td>

                              <td className="py-2 px-2 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <ChangeRateBadge value={item.change_rate} />
                                  <span className="text-xs text-gray-400">
                                    {isNewItem
                                      ? "(신규)"
                                      : isTodayChange
                                      ? "(당일 변동)"
                                      : `(${item.days_since_last_sale}일 전 대비)`}
                                  </span>
                                </div>
                              </td>

                              <td className="py-2 px-2 text-right text-gray-400">
                                {formatRelativeTime(item.updated_at)}
                              </td>
                            </tr>
                          );
                        })}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 테이블 본문 (태블릿, 모바일) */}
      <div className="block md:hidden">
        <ItemPriceChangesMobileAccordion
          dailyGroups={filteredDailyGroups}
          openDates={openDates}
          toggleDate={toggleDate}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
