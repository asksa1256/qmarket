"use client";

import { useState } from "react";
import ItemList from "./ItemList";
import { ItemCategory } from "@/features/item/model/itemTypes";
import ItemsFilter from "@/features/item-search/ui/ItemsFilter";
import { FilterParams } from "../model/types";

export default function CategoryItemFilteredList({
  category,
}: {
  category: ItemCategory;
}) {
  const [filterParams, setFilterParams] = useState<FilterParams>({
    sortBy: "created_at" as "created_at" | "price",
    sortOrder: "desc" as "asc" | "desc",
  });

  return (
    <section className="flex gap-4 md:flex-row flex-col">
      <div className="shrink-0">
        <div className="sticky top-20">
          <h3 className="md:text-lg font-bold mb-2 text-base">필터</h3>
          <ItemsFilter
            variant="sidebar"
            onFilterChange={(filters) => setFilterParams(filters)}
          />
        </div>
      </div>

      <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* 판매해요 */}
        <div className="flex flex-col gap-2">
          <h3 className="md:text-lg font-bold text-base">판매해요</h3>
          <ItemList
            category={category}
            isForSale={true}
            isSold={false}
            filterParams={filterParams}
            className="pb-0"
          />
        </div>

        {/* 구매해요 */}
        <div className="flex flex-col gap-2">
          <h3 className="md:text-lg font-bold text-base">구매해요</h3>
          <ItemList
            category={category}
            isForSale={false}
            isSold={false}
            filterParams={filterParams}
            className="pb-0"
          />
        </div>
      </div>
    </section>
  );
}
