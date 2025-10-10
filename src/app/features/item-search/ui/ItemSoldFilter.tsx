"use client";

import React from "react";
import { Button } from "@/shared/ui/button";

interface ItemSoldFilterProps {
  value?: boolean | null;
  onChange: (value: boolean | null) => void;
}

function ItemSoldFilter({ value, onChange }: ItemSoldFilterProps) {
  const handleClick = (newValue: boolean) => {
    onChange(value === newValue ? null : newValue); // 토글
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleClick(false)}
        className={`px-3 py-1 rounded-md border text-sm transition ${
          value === false
            ? "font-bold"
            : "bg-white text-black hover:bg-gray-100"
        }`}
      >
        판매중
      </Button>
      <Button
        onClick={() => handleClick(true)}
        className={`px-3 py-1 rounded-md border text-sm transition ${
          value === true ? "font-bold" : "bg-white text-black hover:bg-gray-100"
        }`}
      >
        판매완료
      </Button>
    </div>
  );
}

export default React.memo(ItemSoldFilter);
