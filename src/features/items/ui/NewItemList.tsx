"use client";

import ItemCardSmall from "@/features/item/ui/ItemCardSmall";
import { ItemCardSmallProps } from "@/features/item/ui/ItemCardSmall";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { FetchError } from "@/shared/config/types";
import { useState } from "react";
import { FILTER_CATEGORIES_MAP } from "@/shared/config/constants";
import { Button } from "@/shared/ui/button";

interface NewItemListProps {
  title: string;
  items: ItemCardSmallProps[] | null;
  value: string;
  error: FetchError | null;
}

export type FilterCategoryKey = keyof typeof FILTER_CATEGORIES_MAP;

export default function NewItemList({
  title,
  items,
  value,
  error,
}: NewItemListProps) {
  const [selectedCategories, setSelectedCategories] = useState<
    FilterCategoryKey[]
  >([]);

  const toggleCategory = (category: FilterCategoryKey) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredItems =
    items && selectedCategories.length > 0
      ? items.filter((item) => {
          const selectedKoreanCategories = selectedCategories.map(
            (key) => FILTER_CATEGORIES_MAP[key] // db값에 맞게 한글로 변환
          );
          return selectedKoreanCategories.includes(item.category);
        })
      : items;

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="font-bold text-base md:text-lg">
        {title} {!error && items ? `(${items.length}개)` : ""}
      </AccordionTrigger>
      <AccordionContent>
        {error ? (
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
        ) : !items || items.length === 0 ? (
          <p className="text-foreground/50">
            이번 달 새로운 아이템이 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {/* 카테고리 필터 */}
            <div className="flex gap-2 flex-wrap">
              {(
                Object.entries(FILTER_CATEGORIES_MAP) as [
                  FilterCategoryKey,
                  string
                ][]
              ).map(([key, label]) => (
                <Button
                  key={key}
                  variant={
                    selectedCategories.includes(key) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => toggleCategory(key)}
                  className="text-xs md:text-sm"
                >
                  {label}
                </Button>
              ))}
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategories([])}
                  className="text-xs md:text-sm text-foreground/60"
                >
                  전체 보기
                </Button>
              )}
            </div>

            {/* 아이템 목록 */}
            <div className="flex flex-wrap gap-2">
              {filteredItems && filteredItems.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {filteredItems.map((item) => (
                    <ItemCardSmall key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-foreground/50">
                  선택한 카테고리에 해당하는 아이템이 없습니다.
                </p>
              )}
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
