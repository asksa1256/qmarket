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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["best_dresser"],
      queryFn: async ({ pageParam = 0 }) => {
        const from = (pageParam as number) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error } = await supabase
          .from("best_dresser")
          .select("*")
          .order("votes", { ascending: false })
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {data?.pages.map((page) =>
          page.map((entry) => (
            <EntryCard key={entry.id} data={entry} user={user} />
          ))
        )}
      </div>

      <div
        ref={loadMoreRef}
        className="h-20 flex items-center justify-center mt-10"
      >
        {isFetchingNextPage && (
          <Loader2 className="animate-spin text-pink-500" />
        )}
      </div>
    </>
  );
}
