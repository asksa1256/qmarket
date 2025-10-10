"use client";

import { useInfiniteItems } from "@/features/item-list-pagination/model/useInfiniteItems";
import { Item } from "@/entities/item/model/types";
import { useRef, useEffect, useMemo } from "react";
import { ItemListWidget } from "@/widgets/item-list/ui/ItemListWidget";
import { useState } from "react";
import SearchInput from "@/features/item-search/ui/SearchInput";
import ItemUploadModal from "@/features/item-upload-modal/ui/ItemUploadModal";
import { Button } from "@/shared/ui/button";
import {
  ArrowDown01,
  ArrowDown10,
  ClockArrowDown,
  RefreshCcw,
} from "lucide-react";
import ItemMultiFilter from "@/widgets/item-multi-filter/ui/ItemMultiFilter";
import { ItemGenderKey } from "@/features/item-search/ui/ItemGenderFilter";
import { Label } from "@/shared/ui/label";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { useUser } from "@/shared/hooks/useUser";

interface ClientMoreItemsProps {
  initialItems: Item[];
}

export default function ClientMoreItems({
  initialItems,
}: ClientMoreItemsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"price_asc" | "price_desc" | null>(null);
  const [filters, setFilters] = useState<{
    category: string | null;
    gender: ItemGenderKey | null;
    isSold: boolean | null;
  }>({
    category: null,
    gender: null,
    isSold: null,
  });

  const { data: user } = useUser();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteItems({
    initialItems,
    search: searchQuery,
    sort,
    category: filters.category,
    gender: filters.gender,
    sold: filters.isSold,
  });

  const allItems = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [sort, searchQuery, filters, refetch]);

  const { loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        데이터 로딩 중 오류: {error.message}
      </div>
    );
  }

  const handleResetFilter = () => {
    setSort(null);
    setSearchQuery("");
    setFilters({ category: null, gender: null, isSold: null });
  };

  return (
    <div className="mt-4">
      <div className="flex gap-4 items-center p-4 rounded-xl border border-gray-200 shadow-sm bg-white">
        {/* 필터 */}
        <ItemMultiFilter
          category={filters.category}
          gender={filters.gender}
          isSold={filters.isSold}
          onChange={setFilters}
        />

        {/* 정렬 */}
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-gray-600 font-medium">정렬</Label>
          <Button
            variant="outline"
            onClick={() =>
              setSort((prev) =>
                prev === null
                  ? "price_asc"
                  : prev === "price_asc"
                  ? "price_desc"
                  : null
              )
            }
          >
            {!sort ? (
              <ClockArrowDown />
            ) : sort === "price_asc" ? (
              <ArrowDown01 />
            ) : (
              <ArrowDown10 />
            )}
            {!sort
              ? "최신순"
              : sort === "price_asc"
              ? "가격 낮은순"
              : "가격 높은순"}
          </Button>
        </div>

        {/* 검색 */}
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-gray-600 font-medium">검색어</Label>
          <SearchInput
            value={searchQuery}
            className="border border-gray-300 rounded-lg shadow-sm text-sm w-auto"
            onSearch={(e: string) => setSearchQuery(e)}
          />
        </div>

        {/* 초기화 버튼 */}
        <Button
          variant="outline"
          className="self-end ml-auto"
          onClick={handleResetFilter}
        >
          <RefreshCcw />
          초기화
        </Button>
      </div>

      <div className="flex items-center justify-end mb-4 gap-2 mt-12">
        {!user && (
          <p className="text-sm text-gray-500">
            * 아이템 등록은 회원 기능입니다.
          </p>
        )}

        {/* 아이템 등록 버튼 */}
        <ItemUploadModal />
      </div>

      {/* 아이템 목록 */}
      <ItemListWidget items={allItems} isLoading={isFetchingNextPage} />

      {/* 무한 스크롤 */}
      <div ref={loadMoreRef} className="h-10">
        {isFetchingNextPage ? (
          <p className="text-center mt-4 text-gray-500 text-sm">
            아이템 로드 중...
          </p>
        ) : hasNextPage ? null : (
          <p className="text-center mt-4 text-gray-500 text-sm">
            마지막 페이지입니다.
          </p>
        )}
      </div>
    </div>
  );
}
