"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatRelativeTime } from "@/shared/lib/formatters";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import ChevronUpDown from "@/shared/ui/Icon/ChevronUpDown";
import { cn } from "@/shared/lib/utils";
import ItemPriceChangesCards from "./ItemPriceChangesCards";
import { ChangeRateSortOrder } from "../../model/itemPriceChangeTypes";
import { ItemPriceChange } from "../../model/itemPriceChangeTypes";

interface Props {
  items: ItemPriceChange[];
  isLoading: boolean;
  preview?: boolean;
  filter: "all" | "up" | "down";
}

export default function ItemPriceChangesTable({
  items,
  isLoading,
  preview = false,
  filter,
}: Props) {
  const [sortOrder, setSortOrder] = useState<ChangeRateSortOrder>("default");
  const today = new Date().toISOString().split("T")[0];

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === "default") return "desc";
      if (prev === "desc") return "asc";
      return "default";
    });
  };

  // 필터링 + 정렬
  const filteredAndSortedItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];

    let list = [...items];

    // 변동률 상승/하락 필터
    if (filter === "up") {
      list = list.filter((item) => item.change_rate > 0);
    } else if (filter === "down") {
      list = list.filter((item) => item.change_rate < 0);
    }

    // 최근 거래순 정렬
    if (sortOrder === "default") {
      list.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } else if (sortOrder === "desc") {
      // 변동률 정렬
      list.sort((a, b) => Math.abs(b.change_rate) - Math.abs(a.change_rate));
    } else if (sortOrder === "asc") {
      list.sort((a, b) => Math.abs(a.change_rate) - Math.abs(b.change_rate));
    }

    return list;
  }, [items, filter, sortOrder]);

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
            <tbody className="divide-y divide-gray-100 min-h-[300px]">
              {items?.length === 0 && (
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
              {filteredAndSortedItems.map((item) => {
                const isRising = item.change_rate > 0;
                const isFalling = item.change_rate < 0;

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

                    {/* 현재 시세 */}
                    <td className="py-3 px-2 font-semibold text-gray-900">
                      {item.cur_price.toLocaleString("ko-KR")}
                    </td>

                    {/* 이전 시세 */}
                    <td className="py-3 px-2 text-gray-500">
                      {item.prev_price
                        ? Math.floor(item.prev_price).toLocaleString("ko-KR")
                        : "-"}
                    </td>

                    {/* 변동률 */}
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
                          {isNewItem || item.days_since_last_sale === 0
                            ? "(신규)"
                            : `(${item.days_since_last_sale}일 전 대비)`}
                        </span>
                      </div>
                    </td>

                    {/* 최근 거래일 */}
                    <td className="py-3 px-2 text-right text-gray-400">
                      {formatRelativeTime(item.updated_at)}
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
          items={filteredAndSortedItems}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
