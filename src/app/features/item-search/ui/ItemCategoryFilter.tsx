import { ITEM_CATEGORY_MAP } from "@/shared/config/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import React from "react";

interface Props {
  value: ItemCategoryKey | null;
  onChange: (value: ItemCategoryKey | null) => void;
}
export type ItemCategoryKey = keyof typeof ITEM_CATEGORY_MAP;

function ItemCategoryFilter({ value, onChange }: Props) {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(val) => onChange((val as ItemCategoryKey) || null)}
    >
      <SelectTrigger className="w-[126px]">
        <SelectValue placeholder="카테고리 선택" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ITEM_CATEGORY_MAP).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default React.memo(ItemCategoryFilter);
