"use client";

import { useInfiniteItems } from "@/features/item-list-pagination/model/useInfiniteItems";
import { Item } from "@/entities/item/model/types";
import { useMemo } from "react";
import { ItemTable } from "@/widgets/item-list/ui/ItemTable";
import { useState } from "react";
import SearchInput from "@/features/item-search/ui/SearchInput";
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
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/ui/accordion";

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isFetching,
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
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border p-4 mt-4 flex flex-col gap-1">
        <p className="text-sm text-gray-500">
          * 판매 아이템 등록은
          <b className="mx-1">&apos;내 아이템&apos;</b>
          에서 할 수 있습니다.
          <Link
            href="/my-items"
            className="text-sm ml-1 underline underline-offset-4 text-gray-500 font-medium hover:text-blue-600 hover:font-bold"
          >
            바로가기
          </Link>
        </p>

        <p className="text-sm text-gray-500">
          * 시세 조작이 의심되는 아이템은 신고해주세요. (허위 신고를 방지하기
          위해 로그인 후 신고 가능합니다.)
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-filter-sort">
          <AccordionTrigger className="text-sm justify-end gap-2 font-medium pt-0 pb-4 text-gray-500">
            🔍 필터 열기/닫기
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-4 items-center p-4 rounded-xl border border-gray-200 shadow-sm bg-white">
              {/* 필터 */}
              <ItemMultiFilter
                category={filters.category}
                gender={filters.gender}
                isSold={filters.isSold}
                onChange={setFilters}
              />

              {/* 정렬 */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600 font-medium">
                  정렬
                </Label>
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
                <Label className="text-sm text-gray-600 font-medium">
                  검색어
                </Label>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* 아이템 목록 */}
      <div className="mt-4">
        <ItemTable
          items={allItems}
          isLoading={isFetching && !isFetchingNextPage}
        />
      </div>

      {/* 무한 스크롤 */}
      <div ref={loadMoreRef} className="h-10">
        {isFetchingNextPage && (
          <p className="text-center mt-4 text-gray-500 text-sm">
            아이템 로드 중...
          </p>
        )}
        {!isFetching && allItems.length > 0 && !hasNextPage && (
          <p className="text-center mt-4 text-gray-500 text-sm pb-20">
            마지막 페이지입니다.
          </p>
        )}
      </div>
    </div>
  );
}
