"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import EntryCard from "./EntryCard";
import { Loader2 } from "lucide-react";
import { BestDresserEntry } from "../model/bestDresserType";
import { User } from "@supabase/supabase-js";

const ITEMS_PER_PAGE = 12;

export default function EntryList({ user }: { user: User | null }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["best_dresser"],
      queryFn: async ({ pageParam = 0 }) => {
        const from = (pageParam as number) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error } = await supabase
          .from("best_dresser")
          .select("*")
          .order("votes", { ascending: false })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) throw error;
        return data as BestDresserEntry[];
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined;
      },
    });

  const { loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <>
      {isPending ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-pink-500" />
          <p className="text-sm text-foreground/50">로딩중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {data?.pages.map((page, pageIndex) =>
            page.map((entry, entryIndex) => {
              // 첫번째 페이지의 1,2,3번째 요소에만 스타일 추가 (무한 스크롤 시 각 페이지별 1,2,3번째 요소 스타일 방지)
              const rank = pageIndex === 0 ? entryIndex : -1;

              return (
                <EntryCard
                  key={entry.id}
                  data={entry}
                  user={user}
                  rank={rank}
                />
              );
            })
          )}

          <div
            ref={loadMoreRef}
            className="h-20 flex items-center justify-center mt-10"
          >
            {isFetchingNextPage && (
              <Loader2 className="animate-spin text-pink-500" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
