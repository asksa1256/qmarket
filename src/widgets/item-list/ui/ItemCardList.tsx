"use client";

import { useState, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ItemCard from "@/entities/item/ui/ItemCard";
import { Item } from "@/entities/item/model/types";
import { supabase } from "@/shared/api/supabase-client";
import ItemUploadModal from "@/features/item-upload-modal/ui/ItemUploadModal";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";
import SearchInput from "@/features/item-search/ui/SearchInput";
import {
  ITEMS_TABLE_NAME,
  SELECT_ITEM_COLUMNS,
} from "@/shared/config/constants";
import { getDailyItemCountAction } from "@/features/item-upload-modal/model/actions";
import { DAILY_LIMIT } from "@/shared/lib/redis";
import DailyLimitDisplay from "@/features/item-upload-modal/ui/DailyLimitDisplay";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import ItemSoldFilter from "@/features/item-search/ui/ItemSoldFilter";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

interface Props {
  userId: string;
}

const fetchMyItems = async (
  userId: string,
  limit: number = 10,
  offset: number = 0,
  soldFilter: boolean | null
) => {
  let query = supabase
    .from(ITEMS_TABLE_NAME)
    .select(SELECT_ITEM_COLUMNS)
    .eq("user_id", userId);

  if (soldFilter !== null) {
    query = query.eq("is_sold", soldFilter);
  }

  const { data, error } = await query
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("서버 초기 데이터 로딩 오류:", error);
    throw new Error(error.message);
  }

  return data as Item[];
};

export default function ItemCardList({ userId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [soldFilter, setSoldFilter] = useState<boolean | null>(null); // 판매 상태 필터

  // 일일 등록 카운트
  const { data: limitStatus, refetch: refetchLimitInfo } = useQuery({
    queryKey: ["dailyItemCount", userId],
    queryFn: getDailyItemCountAction,
    initialData: { count: 0, remaining: DAILY_LIMIT },
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["my-items", userId, searchQuery, soldFilter],
    queryFn: ({ pageParam = 0 }) =>
      fetchMyItems(userId, 10, pageParam, soldFilter),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 10 ? undefined : allPages.length * 10,
    initialPageParam: 0,
  });

  const items = data?.pages.flat() ?? [];

  const filteredItems = useMemo(() => {
    if (!data) return [];

    return data.pages
      .flatMap((page) => page)
      .filter((item) =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [data, searchQuery]);

  const { loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const isEmpty = !isLoading && items.length === 0;

  return (
    <div className="pb-10 grow">
      {/* 상단 컨트롤 영역 */}
      {/* <div className="flex flex-wrap md:flex-row gap-4 md:gap-0 w-full mb-4 justify-between">
        <ButtonToMain />

        <div className="flex flex-wrap md:flex-row justify-end md:justify-start gap-2 w-full md:w-auto">
          <div className="md:mb-4">
            <ItemSoldFilter value={soldFilter} onChange={setSoldFilter} />
          </div>

          <div className="w-full text-right md:w-auto md:text-left">
            <SearchInput
              value={searchQuery}
              className="border border-gray-300 rounded-lg shadow-sm text-sm w-auto"
              onSearch={(value: string) => setSearchQuery(value)}
            />
          </div>
        </div>
        <div className="w-full text-right">
          <ItemUploadModal
            onSuccess={() => {
              refetchLimitInfo();
              refetch();
            }}
          />
        </div>
      </div> */}

      {/* 아이템 등록 가능 횟수 */}
      {/* <div className="flex justify-end mb-4">
        <DailyLimitDisplay remaining={limitStatus.remaining} />
      </div>
      
      {/* 안내 문구 */}
      {/* <div className="rounded-xl border p-4 mt-4">
        <p className="text-gray-500 text-sm">
          * <b>판매완료</b> 처리는 <b>아이템 수정</b>을 이용해주세요.
        </p>
      </div> */}

      {isEmpty && (
        <div className="pt-8 items-center justify-center text-sm text-gray-500">
          등록된 아이템이 없습니다. 판매중인 아이템을 등록해주세요.
        </div>
      )}

      {/* 아이템 리스트 */}
      {/* {isLoading ? (
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-center mt-4 text-gray-500 text-sm">
            아이템 로드 중...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )} */}
      {isLoading ? (
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-center mt-4 text-gray-500 text-sm">
            아이템 로드 중...
          </p>
        </div>
      ) : (
        <div className="flex flex-col mt-4 max-h-[480px] overflow-auto">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* 무한 스크롤 */}
      <div ref={loadMoreRef} className="h-10">
        {isFetchingNextPage ? (
          <p className="text-center mt-4 text-gray-500 text-sm">
            아이템 로드 중...
          </p>
        ) : (
          !isLoading &&
          !isEmpty &&
          !hasNextPage && (
            <p className="text-center mt-4 text-gray-500 text-sm pt-4 pb-20">
              마지막 페이지입니다.
            </p>
          )
        )}
      </div>
    </div>
  );
}
