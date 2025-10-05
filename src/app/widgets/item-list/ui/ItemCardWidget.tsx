"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import ItemCard from "@/entities/item/ui/ItemCard";
// import { fetchMyItems } from "@/entities/item/model/server-fetch";
import { Item } from "@/entities/item/model/types";
import { supabase } from "@/shared/api/supabase-client";

interface Props {
  userId: string;
}

export const fetchMyItems = async (
  userId: string,
  limit: number = 10,
  offset: number = 0
): Promise<Item[]> => {
  const { data, error } = await supabase
    .from("items")
    .select(
      `
        id, item_name, price, image, 
        is_online, item_source, nickname, is_sold, user_id, item_gender
    `
    )
    .eq("user_id", userId)
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("서버 초기 데이터 로딩 오류:", error);
    throw new Error(error.message);
  }

  return data as Item[];
};

export default function ItemCardWidget({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["my-items", userId],
      queryFn: ({ pageParam = 0 }) => fetchMyItems(userId, 10, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < 10) return undefined;
        return allPages.length * 10;
      },
      initialPageParam: 0,
    });

  const items = data?.pages.flat() ?? [];

  return (
    <div>
      <ol>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </ol>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          {isFetchingNextPage ? "불러오는 중..." : "더 불러오기"}
        </button>
      )}
    </div>
  );
}
