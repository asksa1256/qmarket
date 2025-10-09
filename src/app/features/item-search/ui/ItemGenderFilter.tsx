"use client";

import { ITEM_GENDER_MAP } from "@/shared/config/constants";

interface ItemGenderFilterProps {
  value?: string | null;
  onChange: (key: ItemGenderKey | null) => void;
}
export type ItemGenderKey = keyof typeof ITEM_GENDER_MAP;

export default function ItemGenderFilter({
  value,
  onChange,
}: ItemGenderFilterProps) {
  return (
    <div className="flex gap-2">
      {Object.entries(ITEM_GENDER_MAP).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key as ItemGenderKey)}
          className={`px-3 py-1 rounded-full border text-sm transition ${
            value === key
              ? "bg-pink-500 text-white border-pink-500"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
