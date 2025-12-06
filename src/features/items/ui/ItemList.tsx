"use client";

import getFilteredItems from "../model/getFilteredItems";
import { useQuery } from "@tanstack/react-query";
import ItemCard from "@/features/item/ui/ItemCard";
import { ItemCategory, ItemGender } from "@/features/item/model/itemTypes";
import { cn } from "@/shared/lib/utils";

interface ItemListProps {
  itemName?: string;
  itemGender?: ItemGender;
  category?: ItemCategory;
  isForSale?: boolean;
  isSold?: boolean;
  className?: string;
  filterParams?: {
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "created_at" | "price";
    sortOrder?: "asc" | "desc";
  };
}

export default function ItemList({
  itemName,
  itemGender,
  category,
  isForSale,
  isSold,
  className,
  filterParams = {
    sortBy: "created_at",
    sortOrder: "desc",
  },
}: ItemListProps) {
  const { data, isPending } = useQuery({
    queryKey: [
      "filtered-items",
      itemName,
      itemGender,
      category,
      isForSale,
      isSold,
      filterParams.minPrice,
      filterParams.maxPrice,
      filterParams.sortBy,
      filterParams.sortOrder,
    ],
    queryFn: () =>
      getFilteredItems({
        itemName,
        itemGender,
        category,
        isForSale,
        isSold,
        ...filterParams,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  if (isPending) return <div>로딩 중...</div>;

  return (
    <div className={cn("pb-10 shrink-0", className)}>
      <div className="flex flex-col h-[400px] overflow-auto rounded-2xl border border-border">
        {data?.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            등록된 아이템이 없습니다.
          </div>
        ) : (
          <>
            {data?.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
