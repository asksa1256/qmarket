"use client";

import { useQuery } from "@tanstack/react-query";
import SaleHistoryChart from "@/features/market/ui/SaleHistoryChart";
import getItemSaleHistory from "@/features/item/model/getItemSaleHistory";
import {
  ItemGender,
  ItemCategory,
  ItemSource,
} from "@/features/item/model/itemTypes";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";
import ItemList from "@/features/items/ui/ItemList";

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
  const { data: saleHistory, isPending } = useQuery({
    queryKey: ["item-sale-history", item.name, item.item_gender],
    queryFn: () => getItemSaleHistory(item.name, item.item_gender),
  });

  if (isPending) {
    return <div>로딩중...</div>;
  }

  return (
    <section className="w-full lg:max-w-6xl mx-auto">
      <ButtonToBack />

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        <div className="rounded-xl lg:sticky lg:top-24 w-full lg:w-64 order-1 lg:order-1">
          <h2 className="text-xl font-bold mb-4 text-gray-800">아이템 정보</h2>

          <div className="flex flex-col items-center">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-36 h-40 object-cover rounded-xl border border-gray-200 p-1 mb-4"
              />
            )}

            <h1 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">
              {item.name}
            </h1>

            <div className="w-full space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-gray-500">성별:</span>
                <span>{item.item_gender}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-gray-500">카테고리:</span>
                <span>{item.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">출처:</span>
                <span>{item.item_source}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 아이템 팝니다/삽니다 목록 및 차트 */}
        <div className="flex-1 order-2 lg:order-2">
          <div className="flex flex-wrap md:flex-row gap-4">
            <div className="w-full md:w-[48%] grow shrink-0">
              <h3 className="md:text-lg font-bold mb-2 text-base">판매해요</h3>
              <ItemList
                itemName={item.name}
                itemGender={item.item_gender}
                isForSale={true}
                isSold={false}
              />
            </div>

            <div className="w-full md:w-[48%] grow shrink-0">
              <h3 className="md:text-lg font-bold mb-2 text-base">구매해요</h3>
              <ItemList
                itemName={item.name}
                itemGender={item.item_gender}
                isForSale={false}
                isSold={false}
              />
            </div>
          </div>

          <SaleHistoryChart data={saleHistory ?? []} />
        </div>
      </div>
    </section>
  );
}
