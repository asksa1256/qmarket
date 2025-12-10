"use client";

import { useState } from "react";
import ItemsFilter from "@/features/item-search/ui/ItemsFilter";
import ItemList from "./ItemList";

interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  sortBy: "created_at" | "price";
  sortOrder: "asc" | "desc";
}

export default function ItemsClient() {
  const [filterParams, setFilterParams] = useState<FilterParams>({
    sortBy: "created_at" as "created_at" | "price",
    sortOrder: "desc" as "asc" | "desc",
  });

  return (
    <>
      <ItemsFilter
        onFilterChange={(filters) => setFilterParams(filters)}
        className="mb-4"
      />

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* 팝니다 */}
        <div>
          <h3 className="md:text-lg font-bold mb-2 text-base">판매해요</h3>
          <ItemList
            isForSale={true}
            isSold={false}
            filterParams={filterParams}
          />
        </div>

        {/* 삽니다 */}
        <div>
          <h3 className="md:text-lg font-bold mb-2 text-base">구매해요</h3>
          <ItemList
            isForSale={false}
            isSold={false}
            filterParams={filterParams}
          />
        </div>
      </div>
    </>
  );
}
