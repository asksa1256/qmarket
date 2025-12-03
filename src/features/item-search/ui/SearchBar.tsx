"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";
import { SearchItemInfo } from "@/features/item/model/itemTypes";
import { useRouter } from "next/navigation";

const SearchBar = ({ className }: { className?: string }) => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSelectSuggestion = (s: SearchItemInfo) => {
    router.push(`/item/${s.name}/${s.item_gender}`);
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
