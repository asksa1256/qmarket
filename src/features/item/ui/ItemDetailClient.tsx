"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import SaleHistoryChart from "@/features/market/ui/SaleHistoryChart";
import getItemSaleHistory from "@/features/item/model/getItemSaleHistory";
import {
  ItemGender,
  ItemCategory,
  ItemSource,
} from "@/features/item/model/itemTypes";

interface ItemDetail {
  id: string;
  name: string;
  item_gender: ItemGender;
  image: string | null;
  category: ItemCategory;
  item_source: ItemSource;
}

interface ItemDetailProps {
  item: ItemDetail;
}

export default function ItemDetailClient({ item }: ItemDetailProps) {
  const {
    data: saleHistory,
    isError,
    error,
    isPending,
  } = useQuery({
    queryKey: ["item-sale-history", item.name, item.item_gender],
    queryFn: () => getItemSaleHistory(item.name, item.item_gender),
  });

  if (isPending) {
    return <div>로딩중...</div>;
  }

  if (isError) {
    console.error("Item fetch error:", error);
    return <div>존재하지 않는 아이템입니다.</div>;
  }

  return (
    <section>
      <h1>{item.name}</h1>
      <p>성별: {item.item_gender}</p>
      <p>카테고리: {item.category}</p>
      <p>획득처: {item.item_source}</p>

      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-48 h-auto rounded-md mt-3"
        />
      )}

      <SaleHistoryChart data={saleHistory ?? []} />
    </section>
  );
}
