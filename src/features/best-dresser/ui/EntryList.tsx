"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import EntryCard from "./EntryCard";
import { Loader2 } from "lucide-react";
import { BestDresserEntry } from "../model/bestDresserType";
import { User } from "@supabase/supabase-js";

const ITEMS_PER_PAGE = 12;

type SortType = "latest" | "votes";

export default function EntryList({ user }: { user: User | null }) {
  const [sort, setSort] = useState<SortType>("votes");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["best_dresser", sort],
      queryFn: async ({ pageParam = 0 }) => {
        const from = (pageParam as number) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        let query = supabase
          .from("best_dresser")
          .select("*, comments_count:best_dresser_comments(count)");

        if (sort === "votes") {
          query = query
            .order("votes", { ascending: false })
            .order("created_at", { ascending: false });
        }

        if (sort === "latest") {
          query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query.range(from, to);

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

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-pink-500" />
        <p className="text-sm text-foreground/50">로딩중...</p>
      </div>
    );
  }

  if (!isPending && data?.pages[0]?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pb-30">
        <p className="text-center text-foreground/70">
          💬
          <br /> 아직 등록된 아바타가 없습니다.
          <br />
          첫번째 참가자가 되어보세요!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex justify-end mb-8">
          <div className="flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setSort("votes")}
              className={`px-4 py-2 text-sm font-bold rounded-md transition
        ${
          sort === "votes"
            ? "bg-white shadow text-pink-600"
            : "text-foreground/50 hover:text-foreground"
        }`}
            >
              👍 좋아요순
            </button>

            <button
              onClick={() => setSort("latest")}
              className={`px-4 py-2 text-sm font-bold rounded-md transition
        ${
          sort === "latest"
            ? "bg-white shadow text-purple-600"
            : "text-foreground/50 hover:text-foreground"
        }`}
            >
              🕒 최신순
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {data?.pages.map((page, pageIndex) =>
            page.map((entry, entryIndex) => {
              // 첫번째 페이지의 1,2,3번째 요소에만 스타일 추가 (무한 스크롤 시 각 페이지별 1,2,3번째 요소 스타일 방지)
              const rank =
                sort === "votes" && pageIndex === 0 ? entryIndex : -1;

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
      </div>
    </>
  );
}
