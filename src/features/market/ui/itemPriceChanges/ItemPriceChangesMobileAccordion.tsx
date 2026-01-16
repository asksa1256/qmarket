"use client";

import Image from "next/image";
import Link from "next/link";
import { DailyGroup } from "./ItemPriceChangesTable";
import { formatDateYMD } from "@/shared/lib/formatters";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import ChangeRateBadge from "../ChangeRateBadge";

export default function ItemPriceChangesMobileAccordion({
  dailyGroups,
  openDates,
  toggleDate,
  isLoading,
}: {
  dailyGroups: DailyGroup[];
  openDates: Set<string>;
  toggleDate: (date: string) => void;
  isLoading: boolean;
}) {
  const today = new Date().toISOString().split("T")[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (dailyGroups.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        해당 기간의 시세 변동 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {dailyGroups.map(({ date, items }) => {
        const isOpen = openDates.has(date);

        return (
          <div
            key={date}
            className="border rounded-xl overflow-hidden bg-background"
          >
            {/* 날짜 아코디언 헤더 */}
            <button
              onClick={() => toggleDate(date)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 text-sm font-semibold"
            >
              <span>{formatDateYMD(date)}</span>
              <span className="text-xs text-gray-500">
                변동 {items.length}개
              </span>
            </button>

            {/* 📦 아이템 카드 리스트 */}
            {isOpen && (
              <ul className="divide-y">
                {items.map((item) => {
                  const itemLogDate = new Date(item.log_date)
                    .toISOString()
                    .split("T")[0];

                  const isNewItem = !item.prev_price;
                  const isTodayChange =
                    !isNewItem &&
                    today === itemLogDate &&
                    item.days_since_last_sale === 0;

                  return (
                    <li key={item.id} className="p-4">
                      <div className="flex gap-3">
                        {/* 이미지 */}
                        <div className="relative w-14 h-16 bg-gray-50 rounded-lg flex-shrink-0">
                          <Image
                            src={item.image || "/images/empty.png"}
                            alt={item.item_name}
                            fill
                            className="object-contain rounded-md"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex justify-between w-full">
                          {/* 아이템 정보, 가격 */}
                          <div className="flex flex-col gap-1 justify-between text-sm">
                            <Link
                              href={`/item/${item.item_name}/${item.item_gender}`}
                              className="font-bold text-sm hover:underline"
                            >
                              {item.item_name}
                              <span className="ml-1 text-xs text-gray-400">
                                ({item.item_gender})
                              </span>
                            </Link>

                            <div className="flex flex-col gap-1">
                              <span className="text-xs">
                                <b className="text-sm">
                                  {item.cur_price.toLocaleString()}원
                                </b>{" "}
                                (현재 시세)
                              </span>
                              <span className="text-foreground/50 text-xs">
                                {item.prev_price !== 0
                                  ? item.prev_price.toLocaleString()
                                  : "-"}
                                원 (이전 시세)
                              </span>
                            </div>
                          </div>

                          {/* 변동률 */}
                          <div className="flex flex-col gap-1 items-end">
                            <span className="text-xs font-medium text-foreground/70">
                              변동률
                            </span>
                            <ChangeRateBadge value={item.change_rate} />
                            <span className="text-xs text-gray-400">
                              (
                              {isNewItem
                                ? "신규"
                                : isTodayChange
                                ? "당일 변동"
                                : `${item.days_since_last_sale}일 전 대비`}
                              )
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
