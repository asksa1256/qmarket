"use client";

import ItemRankingTable from "@/features/item-ranking/ui/ItemRankingTable";
import { supabase } from "@/shared/api/supabase-client";
import { useState } from "react";
import ItemMultiFilter from "@/widgets/item-multi-filter/ui/ItemMultiFilter";
import { ItemGenderKey } from "@/features/item-search/ui/ItemGenderFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";

const ITEMS_PER_PAGE = 20;

export default function ItemRankingView() {
  const [filters, setFilters] = useState<{
    category: string | null;
    gender: ItemGenderKey | null;
  }>({
    category: null,
    gender: null,
  });

  const fetchItems = async ({ pageParam = 0 }) => {
    const start = pageParam * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from("unique_ranked_items")
      .select("*")
      .eq("is_sold", true);

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.gender) {
      const genderMap: Record<ItemGenderKey, string> = {
        w: "여",
        m: "남",
      };
      query = query.eq("item_gender", genderMap[filters.gender]);
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
    queryKey: ["ranked-items", filters],
    queryFn: fetchItems,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const { loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error.message}</div>;
  }

  const allItems = data?.pages.flatMap((page) => page.items) || [];

  return (
    <section className="mt-8">
      <ItemMultiFilter
        category={filters.category}
        gender={filters.gender}
        onChange={setFilters}
        className="mb-4"
      />

      <ItemRankingTable items={allItems} />

      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && <div>더 불러오는 중...</div>}
      </div>

      {!hasNextPage && allItems.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          모든 아이템을 불러왔습니다.
        </div>
      )}
    </section>
  );
}
