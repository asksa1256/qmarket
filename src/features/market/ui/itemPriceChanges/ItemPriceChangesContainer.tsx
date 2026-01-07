"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDateYMD } from "@/shared/lib/formatters";
import { getItemPriceChanges } from "../../model/getItemPriceChanges";
import ItemPriceChangesHeader from "./ItemPriceChangesHeader";
import ItemPriceChangesTable from "./ItemPriceChangesTable";
import ItemPriceChangesSummary from "./ItemPriceChangeSummary";
import useWeekNavigation from "../../model/useWeekNavigation";

interface Props {
  limit?: number;
  preview?: boolean;
  className?: string;
}

export default function ItemPriceChangesContainer({
  limit,
  preview = false,
  className,
}: Props) {
  const [filter, setFilter] = useState<"all" | "up" | "down">("all");

  // 주차 정보 가져오기
  const { start } = useWeekNavigation();

  const {
    data = [],
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["item-price-changes", formatDateYMD(start), limit],
    queryFn: () =>
      getItemPriceChanges({
        limit,
        startDate: start,
      }),
    refetchInterval: 1000 * 60, // 1분
  });

  const priceChanges = Array.isArray(data) ? data : [];

  return (
    <>
      <div className={className}>
        <ItemPriceChangesHeader
          preview={preview}
          filter={filter}
          onFilterChange={setFilter}
        />

        <ItemPriceChangesTable
          items={priceChanges}
          isLoading={isPending}
          preview={preview}
          filter={filter}
        />

        {/* 캐싱 데이터 기반 갱신 */}
        {!isPending && isFetching && (
          <div className="text-xs text-gray-400 text-center py-2">
            데이터 업데이트 중…
          </div>
        )}
      </div>

      {/* 시세 변동 요약 */}
      {!preview && <ItemPriceChangesSummary items={priceChanges} />}
    </>
  );
}
