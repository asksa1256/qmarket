"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";
import { SearchItemInfo } from "@/features/item/model/itemTypes";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  className?: string;
  onSelect?: () => void; // 모바일 사이드바에서 자동완성 선택 시 사이드바 닫힘 처리용
}

const SearchBar = ({ className, onSelect }: SearchBarProps) => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSelectSuggestion = (s: SearchItemInfo) => {
    router.push(`/item/${s.name}/${s.item_gender}`);
    onSelect?.();
  };

  return (
    <div className={className}>
      <SearchInput
        value={value}
        onSearch={setValue}
        onSelectSuggestion={handleSelectSuggestion}
        placeholder="아이템 이름으로 검색"
        className="text-center [&>input]:max-w-[350px] [&>input]:px-4 [&>input]:py-3 [&>input]:h-auto [&>input]:text-base"
      />
    </div>
  );
};

export default SearchBar;
