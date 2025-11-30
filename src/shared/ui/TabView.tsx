"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Item } from "@/features/item/model/itemTypes";
import MarketPriceDashboard from "@/features/market/ui/MarketPriceDashboard";
import ItemRankingView from "@/features/item-ranking/ui/ItemRankingView";

interface Props {
  initialItems: Item[];
}

export default function TabView({ initialItems }: Props) {
  return (
    <Tabs defaultValue="marketPrices" className="max-w-5xl mx-auto">
      <TabsList className="w-full">
        <TabsTrigger value="marketPrices" className="cursor-pointer py-2">
          시세 조회
        </TabsTrigger>
        <TabsTrigger value="items" className="cursor-pointer py-2">
          매물 목록
        </TabsTrigger>
        <TabsTrigger value="marketPriceRanking" className="cursor-pointer py-2">
          시세 랭킹
        </TabsTrigger>
      </TabsList>

      <TabsContent value="marketPrices">
        <MarketPriceDashboard />
      </TabsContent>

      <TabsContent value="marketPriceRanking">
        <ItemRankingView />
      </TabsContent>
    </Tabs>
  );
}
