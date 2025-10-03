"use client";

import ClientMoreItems from "@/widgets/item-list/ui/ClientMoreItems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Item } from "@/entities/item/model/types";

interface Props {
  initialItems: Item[];
}

export default function TabView({ initialItems }: Props) {
  return (
    <Tabs defaultValue="items" className="max-w-4xl mx-auto">
      <TabsList className="w-full">
        <TabsTrigger value="items" className="cursor-pointer py-2">
          판매 현황
        </TabsTrigger>
        <TabsTrigger value="marketPrices" className="cursor-pointer py-2">
          시세 조회
        </TabsTrigger>
      </TabsList>

      <TabsContent value="items">
        <ClientMoreItems initialItems={initialItems} />
      </TabsContent>

      <TabsContent value="marketPrices">시세 조회</TabsContent>
    </Tabs>
  );
}
