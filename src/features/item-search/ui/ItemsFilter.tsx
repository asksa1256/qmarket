"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Filter, RefreshCcw } from "lucide-react";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type SortOption = "created_at" | "price";
type SortOrder = "asc" | "desc";

interface ItemsFilterProps {
  onFilterChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    sortBy: SortOption;
    sortOrder: SortOrder;
  }) => void;
  className?: string;
}

export default function ItemsFilter({
  onFilterChange,
  className,
}: ItemsFilterProps) {
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleApplyFilter = () => {
    const filters = {
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
      sortOrder,
    };
    onFilterChange(filters);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setSortBy("created_at");
    setSortOrder("desc");
    onFilterChange({
      sortBy: "created_at",
      sortOrder: "desc",
    });
  };

  return (
    <div
      className={cn("bg-white rounded-lg border border-border p-4", className)}
    >
      <div className="flex gap-2 w-full">
        {/* 가격 필터 */}
        <div>
          <label className="text-sm font-medium mb-2 block">가격</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="최소"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <span className="text-gray-500">~</span>
            <Input
              type="number"
              placeholder="최대"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>

        {/* 정렬 */}
        <div>
          <label className="text-sm font-medium mb-2 block">정렬</label>
          <div className="flex gap-2">
            {/* <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at">시간순</option>
              <option value="price">가격순</option>
            </Select> */}
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger>
                <SelectValue placeholder="정렬 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="created_at">시간순</SelectItem>
                  <SelectItem value="price">가격순</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as SortOrder)}
            >
              <SelectTrigger>
                <SelectValue placeholder="오름차순/내림차순" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="asc">
                    {sortBy === "price" ? "낮은 가격순" : "오래된순"}
                  </SelectItem>
                  <SelectItem value="desc">
                    {sortBy === "price" ? "높은 가격순" : "최신순"}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">
                {sortBy === "price" ? "높은 가격순" : "최신순"}
              </option>
              <option value="asc">
                {sortBy === "price" ? "낮은 가격순" : "오래된순"}
              </option>
            </Select> */}
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-2 pt-2 self-end">
          <Button type="button" onClick={handleApplyFilter}>
            <Filter />
            필터 적용
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            <RefreshCcw />
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
}
