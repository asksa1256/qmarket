"use client";

import ItemRankingTable from "@/features/item-ranking/ui/ItemRankingTable";
import { supabase } from "@/shared/api/supabase-client";
import { useState } from "react";
import ItemMultiFilter from "@/features/item-search/ui/ItemMultiFilter";
import { ItemGenderKey } from "@/features/item-search/ui/ItemGenderFilter";
import { ItemCategoryKey } from "@/features/item-search/ui/ItemCategoryFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { ITEM_CATEGORY_MAP, ITEM_GENDER_MAP } from "@/shared/config/constants";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/ui/accordion";

const ITEMS_PER_PAGE = 20;

export default function ItemRankingView() {
  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState<{
    category: ItemCategoryKey | null;
    gender: ItemGenderKey | null;
  }>({
    category: null,
    gender: null,
  });

  const fetchItems = async ({ pageParam = 0 }) => {
    const start = pageParam * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    let query = supabase.from("unique_ranked_items").select("*");

    if (filters.category) {
      query = query.eq("category", ITEM_CATEGORY_MAP[filters.category]);
    }

    if (filters.gender) {
      query = query.eq("item_gender", ITEM_GENDER_MAP[filters.gender]);
    }

    if (searchInput.trim()) {
      query = query.ilike("item_name", `%${searchInput.trim()}%`);
    }

    const { data, error } = await query
      .order("price", { ascending: false })
      .range(start, end);

    if (error) throw error;

    return {
      items: data || [],
      nextPage:
        data && data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["ranked-items", filters, searchInput],
    queryFn: fetchItems,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const { loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (error) {
    return <div>오류: {error.message}</div>;
  }

  const allItems = data?.pages.flatMap((page) => page.items) || [];

  const handleResetFilter = () => {
    setSearchInput("");
    setFilters({ category: null, gender: null });
  };

  return (
    <section className="mt-4">
      <div className="rounded-xl border p-4 mt-4 mb-8">
        <p className="text-gray-500 text-sm">
          * 거래 완료 아이템 순위가 집계됩니다.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-filter-sort">
          <AccordionTrigger className="text-sm justify-end gap-2 font-medium pt-0 pb-4 text-gray-500">
            🔍 필터 열기/닫기
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-4 items-center mb-8 p-4 rounded-xl border border-gray-200 shadow-sm bg-white">
              {/* 필터 */}
              <ItemMultiFilter
                category={filters.category}
                gender={filters.gender}
                onChange={setFilters}
              />

              {/* 검색바 */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm text-gray-600 font-medium">
                  검색
                </Label>
                <SearchInput
                  value={searchInput}
                  className="text-sm w-auto"
                  onSearch={(e: string) => setSearchInput(e)}
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

      <ItemRankingTable items={allItems} isLoading={isLoading} />

      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <p className="text-center text-gray-500 text-sm">불러오는 중...</p>
        )}
      </div>
    </section>
  );
}
