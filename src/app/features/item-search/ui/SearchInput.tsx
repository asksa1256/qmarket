"use client";

import { Input } from "@/shared/ui/input";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import debounce from "@/shared/lib/debounce";

interface SearchInputProps {
  value: string;
  className?: string;
  onSearch: (value: string) => void;
}

export default function SearchInput({
  value,
  className,
  onSearch,
}: SearchInputProps) {
  // 입력창에 바로 반영될 로컬 상태
  const [inputValue, setInputValue] = useState(value);

  // 부모 value 변경 시 동기화
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedSearch = useMemo(
    () => debounce((val: string) => onSearch(val), 500),
    [onSearch]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // 입력창 즉시 반영
    debouncedSearch(e.target.value); // 검색 요청만 debounce
  };

  return (
    <Input
      type="text"
      placeholder="상품명 검색"
      value={inputValue} // 내부 상태 사용
      onChange={handleChange}
      className={className}
    />
  );
}
