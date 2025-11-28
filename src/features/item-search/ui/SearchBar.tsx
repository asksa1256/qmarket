"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";
import type { Suggestion } from "@/features/item-search/ui/SearchInput";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSelectSuggestion = (s: Suggestion) => {
    router.push(`/item/${s.id}`);
  };

  return (
    <SearchInput
      value={value}
      onSearch={setValue}
      onSelectSuggestion={handleSelectSuggestion}
      placeholder="아이템 이름으로 검색"
      className="text-center [&>input]:w-[230px]"
    />
  );
};

export default SearchBar;
