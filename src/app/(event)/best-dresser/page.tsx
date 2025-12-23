"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/shared/api/supabase-client";
import EntryCard from "@/features/best-dresser/ui/EntryCard";
import UploadModal from "@/features/best-dresser/ui/UploadModal";
import { BestDresserEntry } from "@/features/best-dresser/model/bestDresserType";
import Footer from "@/shared/ui/Footer";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 12;

export default function BestDresserPage() {
  const [entries, setEntries] = useState<BestDresserEntry[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["best_dresser"],
    queryFn: async ({ pageParam = 0 }) => {
      const from = (pageParam as number) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE + 1;

      const { data, error } = await supabase
        .from("best_dresser")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return data;
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
    <main className="md:mt-[-70px] md:pt-[200px] min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            👗{" "}
            <span className="bg-[linear-gradient(to_right,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7)] bg-clip-text text-transparent">
              2025 큐플레이 베스트 드레서
            </span>
            🩳
          </h1>
          <p className="text-lg text-foreground mb-4">
            2025년 연말 결산! 올해 큐플레이를 빛내준 나만의 코디를 뽐내보세요!
          </p>
          <p className="text-sm text-foreground/60">
            * 계정당 3회까지 참여 가능합니다.
          </p>
          <p className="text-sm text-foreground/60">
            * 중복 참가 이미지는 별도의 공지 없이 삭제됩니다.
          </p>
        </header>

        {/* 참여하기 */}
        <div className="flex justify-center mb-24">
          <UploadModal />
        </div>

        {/* 컨테스트 참가자 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {data?.pages.map((page) =>
            page.map((entry) => <EntryCard key={entry.id} data={entry} />)
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

      <Footer className="mt-20" />
    </main>
  );
}
