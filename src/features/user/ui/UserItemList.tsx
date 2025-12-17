"use client";

import ItemCard from "@/features/item/ui/ItemCard";
import getFilteredUserItems from "../../items/model/getFilteredUserItems";
import { getMyItems } from "@/features/items/model/getMyItems";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

interface Props {
  userId: string;
  isForSale: boolean; // true: 판매 아이템 / false: 구매 아이템
  isSold: boolean; // 거래 완료 여부
}

export default function UserItemList({ userId, isForSale, isSold }: Props) {
  const { data: allItems } = useQuery({
    queryKey: ["my-items", userId],
    queryFn: () => getMyItems(userId),
  });

  const { data: filteredItems, isPending: isLoadingFiltered } = useQuery({
    queryKey: ["filtered-items", userId, isForSale, isSold],
    queryFn: () => getFilteredUserItems({ userId, isForSale, isSold }),
    enabled: !!allItems,
  });

  return (
    <div className="pb-10 grow">
      {/* 아이템 리스트 */}
      <div className="flex flex-col h-[400px] overflow-auto rounded-2xl border border-border">
        {isLoadingFiltered && (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        )}
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
