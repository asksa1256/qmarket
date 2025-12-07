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
    <>
      <ItemsFilter
        onFilterChange={(filters) => setFilterParams(filters)}
        className="w-full mb-4"
      />

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* 판매해요 */}
        <div>
          <h3 className="md:text-lg font-bold mb-2 text-base">판매해요</h3>
          <ItemList
            category={category}
            isForSale={true}
            isSold={false}
            filterParams={filterParams}
          />
        </div>

        {/* 구매해요 */}
        <div>
          <h3 className="md:text-lg font-bold mb-2 text-base">구매해요</h3>
          <ItemList
            category={category}
            isForSale={false}
            isSold={false}
            filterParams={filterParams}
          />
        </div>
      </div>
    </>
  );
}
