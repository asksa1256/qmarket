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

  const allItems = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page);
  }, [data]);

  // sort가 바뀔 때마다 페이지 리셋
  useEffect(() => {
    refetch();
  }, [sort, searchQuery, refetch]);

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
    <div className="mt-4">
      <div className="rounded-xl border p-4">
        <p className="text-gray-500 text-sm">
          * 보다 정확한 시세 반영을 위해, 판매된 아이템은{" "}
          <b>&apos;내 아이템&apos; &gt; &apos;수정하기&apos;</b>에서{" "}
          <b>&apos;판매완료&apos;</b> 상태로 변경해주세요.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4 gap-2 mt-12">
        {/* 검색창 */}
        <div className="flex flex-1 justify-end">
          <SearchInput
            value={searchQuery}
            className="border border-gray-300 rounded-lg shadow-sm text-sm w-auto"
            onSearch={(e: string) => setSearchQuery(e)}
          />
        </div>

        {/* 정렬 버튼 */}
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

        {/* 초기화 버튼 */}
        <Button variant="outline" onClick={handleResetFilter}>
          <RefreshCcw />
          초기화
        </Button>

        {/* 상품 등록 버튼 */}
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
