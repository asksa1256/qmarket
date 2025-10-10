"use client";

import ItemCategoryFilter from "@/features/item-search/ui/ItemCategoryFilter";
import ItemGenderFilter, {
  ItemGenderKey,
} from "@/features/item-search/ui/ItemGenderFilter";
import ItemSoldFilter, {
  ItemIsSoldKey,
} from "@/features/item-search/ui/ItemSoldFilter";
import { Label } from "@/shared/ui/label";

interface ItemMultiFilterProps {
  category: string | null;
  gender: ItemGenderKey | null;
  saleStatus: ItemIsSoldKey | null;
  onChange: (filters: {
    category: string | null;
    gender: ItemGenderKey | null;
    saleStatus: ItemIsSoldKey | null;
  }) => void;
}

export default function ItemMultiFilter({
  category,
  gender,
  saleStatus,
  onChange,
}: ItemMultiFilterProps) {
  const handleCategoryChange = (value: string | null) =>
    onChange({ category: value, gender, saleStatus });

  const handleGenderChange = (value: ItemGenderKey | null) =>
    onChange({ category, gender: value, saleStatus });

  const handleSaleStatusChange = (value: ItemIsSoldKey | null) =>
    onChange({ category, gender, saleStatus: value });

  return (
    <>
      {/* 카테고리 */}
      <div className="flex gap-4">
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
        <div className="flex flex-col gap-1">
          <Label className="text-sm text-gray-600 font-medium">판매 상태</Label>
          <ItemSoldFilter
            value={saleStatus}
            onChange={handleSaleStatusChange}
          />
        </div>
      </div>
    </>
  );
}
