"use client";
import { useInfiniteItems } from "@/features/item-list-pagination/model/useInfiniteItems";
import { Item } from "@/entities/item/model/types";
import { useRef, useEffect, useMemo } from "react";
import { ItemListWidget } from "@/widgets/item-list/ui/ItemListWidget";

interface ClientMoreItemsProps {
  initialItems: Item[];
}

export default function ClientMoreItems({
  initialItems,
}: ClientMoreItemsProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useInfiniteItems(initialItems);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const allItems = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page);
  }, [data]);

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

  return (
    <div className="mt-6 pt-6">
      <ItemListWidget items={allItems} isLoading={isFetchingNextPage} />
      <div ref={loadMoreRef} className="h-10">
        {isFetchingNextPage ? (
          <p className="text-center mt-4">추가 상품 로드 중...</p>
        ) : hasNextPage ? null : (
          <p className="text-center mt-4 text-gray-500">
            모든 상품을 불러왔습니다.
          </p>
        )}
      </div>
    </div>
  );
}
