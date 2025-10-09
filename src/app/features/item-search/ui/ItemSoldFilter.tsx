"use client";

import { ITEM_SALE_STATUS_MAP } from "@/shared/config/constants";

export type ItemSaleStatusKey = keyof typeof ITEM_SALE_STATUS_MAP;

type Props = {
  value?: string | null;
  onChange: (key: ItemSaleStatusKey | null) => void;
};

export default function ItemSoldFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {Object.entries(ITEM_SALE_STATUS_MAP).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key as ItemSaleStatusKey)}
          className={`px-3 py-1 rounded-full border text-sm transition ${
            value === key
              ? "bg-green-600 text-white border-green-600"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
