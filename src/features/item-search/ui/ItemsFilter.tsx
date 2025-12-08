"use client";

import { useState, useRef, ChangeEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Filter, RefreshCcw } from "lucide-react";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Badge } from "@/shared/ui/badge";
import { X } from "lucide-react";

type SortOption = "created_at" | "price";
type SortOrder = "asc" | "desc";

interface ItemsFilterProps {
  variant?: "wide" | "sidebar";
  onFilterChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    sortBy: SortOption;
    sortOrder: SortOrder;
  }) => void;
  className?: string;
}

export default function ItemsFilter({
  variant = "wide",
  className,
  onFilterChange,
}: ItemsFilterProps) {
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const minPriceRef = useRef<HTMLInputElement>(null);
  const maxPriceRef = useRef<HTMLInputElement>(null);
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // 필터 데이터 헬퍼 함수
  const getCurrentFilters = () => ({
    minPrice: minPriceRef.current?.value
      ? Number(minPriceRef.current.value)
      : undefined,
    maxPrice: maxPriceRef.current?.value
      ? Number(maxPriceRef.current.value)
      : undefined,
  });

  // 정렬 변경 시 즉시 적용
  const handleSortChange = (
    newSortBy?: SortOption,
    newSortOrder?: SortOrder
  ) => {
    const currentSortBy = newSortBy ?? sortBy;
    const currentSortOrder = newSortOrder ?? sortOrder;

    onFilterChange({
      ...getCurrentFilters(),
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
    });
  };

  // 가격 필터 적용
  const handleApplyFilter = () => {
    setIsFilterApplied(true);

    onFilterChange({
      ...getCurrentFilters(),
      sortBy,
      sortOrder,
    });
  };

  const handleReset = () => {
    setIsFilterApplied(false);
    if (minPriceRef.current) {
      minPriceRef.current.value = "";
    }
    if (maxPriceRef.current) {
      maxPriceRef.current.value = "";
    }
    setSortBy("created_at");
    setSortOrder("desc");
    onFilterChange({
      sortBy: "created_at",
      sortOrder: "desc",
    });
  };

  const handleResetPrice = () => {
    setIsFilterApplied(false);
    if (minPriceRef.current) {
      minPriceRef.current.value = "";
    }
    if (maxPriceRef.current) {
      maxPriceRef.current.value = "";
    }
    onFilterChange({
      sortBy,
      sortOrder,
    });
  };

  const handleMinPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const minPriceEl = minPriceRef.current;
    if (minPriceEl) {
      minPriceEl.value = e.target.value;
    }
  };

  const handleMaxPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const maxPriceEl = maxPriceRef.current;
    if (maxPriceEl) {
      maxPriceEl.value = e.target.value;
    }
  };

  const hasPriceFilter =
    minPriceRef.current?.value || maxPriceRef.current?.value;

  return (
    <div
      className={cn(
        "bg-background rounded-lg border border-border p-4",
        className
      )}
    >
      <div
        className={cn({
          "flex flex-wrap md:flex-nowrap gap-2 w-full": variant === "wide",
          "flex flex-col gap-4 md:w-[230px] w-full": variant === "sidebar",
        })}
      >
        {/* 가격 필터 */}
        <div className="w-full md:max-w-[300px]">
          <label className="text-sm font-medium mb-2 block">가격</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="최소"
              ref={minPriceRef}
              min="0"
              onChange={handleMinPrice}
            />
            <span className="text-gray-500">~</span>
            <Input
              type="number"
              placeholder="최대"
              ref={maxPriceRef}
              min="0"
              onChange={handleMaxPrice}
            />
          </div>
        </div>

        {/* 정렬 */}
        <div className="w-full md:w-auto">
          <label className="text-sm font-medium mb-2 block">정렬</label>
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                const newSortBy = value as SortOption;
                setSortBy(newSortBy);
                handleSortChange(newSortBy, undefined);
              }}
            >
              <SelectTrigger
                className={variant === "sidebar" ? "grow" : "grow md:grow-0"}
              >
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
              onValueChange={(value) => {
                const newSortOrder = value as SortOrder;
                setSortOrder(newSortOrder);
                handleSortChange(undefined, newSortOrder);
              }}
            >
              <SelectTrigger
                className={variant === "sidebar" ? "grow" : "grow md:grow-0"}
              >
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
          </div>
        </div>

        {/* actions */}
        <div className="flex w-full gap-2 pt-2 self-end">
          <Button
            type="button"
            className={variant === "sidebar" ? "grow" : "grow md:grow-0"}
            onClick={handleApplyFilter}
          >
            <Filter />
            필터 적용
          </Button>
          <Button
            type="button"
            variant="outline"
            className={variant === "sidebar" ? "grow" : "grow md:grow-0"}
            onClick={handleReset}
          >
            <RefreshCcw />
            초기화
          </Button>
        </div>
      </div>

      {/* 필터 적용 badges */}
      {isFilterApplied && (
        <div className="flex items-center mt-2">
          <span className="text-xs mr-2 font-medium">필터: </span>
          {hasPriceFilter && (
            <Badge className="bg-blue-100 text-blue-500 font-medium">
              {Number(minPriceRef.current?.value).toLocaleString()} ~{" "}
              {Number(maxPriceRef.current?.value).toLocaleString()}원
              <button type="button" onClick={handleResetPrice}>
                <X className="size-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
