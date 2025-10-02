"use client";

import { useInfiniteItems } from "@/features/item-list-pagination/model/useInfiniteItems";
import { Item } from "@/entities/item/model/types";
import { useRef, useEffect, useMemo } from "react";
import { ItemListWidget } from "@/widgets/item-list/ui/ItemListWidget";
import { useState } from "react";
import SearchInput from "@/features/item-search/ui/SearchInput";

interface ClientMoreItemsProps {
  initialItems: Item[];
}

export default function ClientMoreItems({
  initialItems,
}: ClientMoreItemsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<"price_asc" | "price_desc" | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteItems(initialItems, searchQuery, sort);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    return data.pages
      .flatMap((page) => page)
      .filter((item) =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [data, searchQuery]);

  // sort가 바뀔 때마다 페이지 리셋
  useEffect(() => {
    refetch();
  }, [sort, refetch]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
  };

  return (
    <div className="mt-6 pt-6">
      {/* 검색, 정렬 */}
      <div className="flex mb-4">
        <SearchInput
          value={searchQuery}
          className="w-auto"
          onSearch={(e: string) => setSearchQuery(e)}
        />

        <button
          className="px-3 py-1 border rounded text-sm"
          onClick={() =>
            setSort((prev) =>
              prev === "price_asc" ? "price_desc" : "price_asc"
            )
          }
        >
          {sort === "price_asc" ? "가격 낮은순" : "가격 높은순"}
        </button>

        <button
          className="px-3 py-1 border rounded text-sm"
          onClick={handleResetFilter}
        >
          초기화
        </button>
      </div>

      {/* 아이템 목록 */}
      <ItemListWidget items={filteredItems} isLoading={isFetchingNextPage} />

      {/* 무한 스크롤 */}
      <div ref={loadMoreRef} className="h-10">
        {isFetchingNextPage ? (
          <p className="text-center mt-4">추가 상품 로드 중...</p>
        ) : hasNextPage ? null : (
          <p className="text-center mt-4 text-gray-500 text-sm">
            모든 상품을 불러왔습니다.
          </p>
        )}
      </div>
    </div>
  );
}
