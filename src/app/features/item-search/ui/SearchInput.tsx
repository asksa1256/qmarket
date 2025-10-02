"use client";

import { Input } from "@/shared/ui/input";
import { ChangeEvent } from "react";

interface SearchInputProps {
  value: string;
  className?: string;
  onChange: (value: string) => void;
}

export default function SearchInput({
  value,
  className,
  onChange,
}: SearchInputProps) {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      type="text"
      placeholder="상품명 검색"
      value={value}
      onChange={handleSearch}
      className={className}
    />
  );
}
