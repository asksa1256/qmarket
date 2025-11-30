"use client";

import ItemCategoryFilter from "@/features/item-search/ui/ItemCategoryFilter";
import { ItemCategoryKey } from "@/features/item-search/ui/ItemCategoryFilter";
import ItemGenderFilter, {
  ItemGenderKey,
} from "@/features/item-search/ui/ItemGenderFilter";
import ItemSoldFilter from "@/features/item-search/ui/ItemSoldFilter";
import { Label } from "@/shared/ui/label";

interface ItemMultiFilterProps {
  category: ItemCategoryKey | null;
  gender: ItemGenderKey | null;
  isSold?: boolean | null;
  className?: string;
  onChange: (filters: {
    category: ItemCategoryKey | null;
    gender: ItemGenderKey | null;
    isSold: boolean | null;
  }) => void;
}

export default function ItemMultiFilter({
  category,
  gender,
  isSold,
  onChange,
  className,
}: ItemMultiFilterProps) {
  const handleCategoryChange = (value: ItemCategoryKey | null) =>
    onChange({
      category: value,
      gender,
      isSold: isSold || null,
    });

  const handleGenderChange = (value: ItemGenderKey | null) =>
    onChange({ category, gender: value, isSold: isSold || null });

  const handleisSoldChange = (value: boolean | null) =>
    onChange({ category, gender, isSold: value });

  return (
    <div className={className}>
      {/* 카테고리 */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-gray-600 font-medium">카테고리</Label>
          <ItemCategoryFilter
            value={category}
            onChange={handleCategoryChange}
          />
        </div>

        {/* 성별 */}
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-gray-600 font-medium">성별</Label>
          <ItemGenderFilter value={gender} onChange={handleGenderChange} />
        </div>

        {/* 판매 상태 */}
        {isSold && (
          <div className="flex flex-col gap-1">
            <Label className="text-sm text-gray-600 font-medium">
              판매 상태
            </Label>
            <ItemSoldFilter value={isSold} onChange={handleisSoldChange} />
          </div>
        )}
      </div>
    </div>
  );
}
