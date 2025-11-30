"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";
import { SearchItemInfo } from "@/features/item/model/itemTypes";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSelectSuggestion = (s: SearchItemInfo) => {
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
