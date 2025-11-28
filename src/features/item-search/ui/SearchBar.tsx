"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";

const SearchBar = () => {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      value={value}
      onSearch={setValue}
      className="text-center [&>input]:w-[230px]"
    />
  );
};

export default SearchBar;
