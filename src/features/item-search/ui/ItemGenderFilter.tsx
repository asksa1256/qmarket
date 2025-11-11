"use client";

import { ITEM_GENDER_MAP } from "@/shared/config/constants";
import React from "react";
import { Button } from "@/shared/ui/button";

interface ItemGenderFilterProps {
  value?: string | null;
  onChange: (key: ItemGenderKey | null) => void;
}
export type ItemGenderKey = keyof typeof ITEM_GENDER_MAP;

function ItemGenderFilter({ value, onChange }: ItemGenderFilterProps) {
  const handleClick = (key: ItemGenderKey) => {
    onChange(value === key ? null : key);
  };

  return (
    <div className="flex gap-2">
      {Object.entries(ITEM_GENDER_MAP).map(([key, label]) => (
        <Button
          key={key}
          onClick={() => handleClick(key as ItemGenderKey)}
          className={`px-3 py-1 rounded-md border text-sm transition ${
            value === key
              ? "font-bold"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

export default React.memo(ItemGenderFilter);
