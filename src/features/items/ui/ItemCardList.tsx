"use client";

import ItemCard from "@/features/item/ui/ItemCard";
import { getDailyItemCountAction } from "@/features/item/model/actions";
import { DAILY_LIMIT } from "@/shared/api/redis";
import getFilteredItems from "../model/getFilteredItems";
import { getMyItems } from "@/features/items/model/getMyItems";
import { useQuery } from "@tanstack/react-query";

interface Props {
  userId: string;
  isForSale: boolean; // true: 판매 아이템 / false: 구매 아이템
  isSold: boolean; // 거래 완료 여부
}

export default function ItemCardList({ userId, isForSale, isSold }: Props) {
  const { data: allItems, isPending: isLoadingItems } = useQuery({
    queryKey: ["my-items", userId],
    queryFn: () => getMyItems(userId),
  });

  const { data: filteredItems, isPending: isLoadingFiltered } = useQuery({
    queryKey: ["filtered-items", userId, isForSale, isSold],
    queryFn: () => getFilteredItems({ userId, isForSale, isSold }),
    enabled: !!allItems, // allItems가 있을 때만 실행
  });

  if (isLoadingItems) return <div>전체 아이템 로딩 중...</div>;
  if (isLoadingFiltered) return <div>필터링 중...</div>;

  return (
    <div className="pb-10 grow">
      {/* 아이템 리스트 */}
      <div className="flex flex-col h-[400px] overflow-auto rounded-2xl border border-border">
        {filteredItems?.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            등록된 아이템이 없습니다.
          </div>
        ) : (
          <>
            {filteredItems?.map((item) => (
              <ItemCard key={item.id} item={item} userId={userId} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
