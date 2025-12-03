"use client";

import { Input } from "@/shared/ui/input";
import { ChangeEvent, useState, useMemo, InputHTMLAttributes } from "react";
import debounce from "@/shared/lib/debounce";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { cn } from "@/shared/lib/utils";
import { useItemsQuery } from "@/shared/hooks/useItemsQuery";
import { useSearchItemQuery } from "@/shared/hooks/useSearchItemQuery";
import { Button } from "@/shared/ui/button";
import Image from "next/image";
import { SearchItemInfo } from "@/features/item/model/itemTypes";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  className?: string;
  onSearch: (value: string) => void;
  onSelectSuggestion?: (suggestion: SearchItemInfo) => void;
}

export default function SearchInput({
  value,
  className,
  onSearch,
  onSelectSuggestion,
  ...rest
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  // 전체 아이템 캐싱
  const { data: allItems = [] } = useItemsQuery();

  // 검색 캐싱
  const { data: suggestions = [], refetch } = useSearchItemQuery(
    inputValue,
    allItems
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setInputValue(val);
        refetch(); // React Query 검색 수행
      }, 300),
    [refetch]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
    if (!suggestionOpen && val.length > 0) setSuggestionOpen(true);
    if (suggestionOpen && val.length === 0) setSuggestionOpen(false);
  };

  const handleSelect = (s: SearchItemInfo) => {
    setInputValue(s.name);
    onSearch(s.name);
    if (onSelectSuggestion) onSelectSuggestion(s);
    setSuggestionOpen(false);
  };

  const handleFocus = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    val.length > 0 ? setSuggestionOpen(true) : setSuggestionOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => setSuggestionOpen(false), 150);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="text"
        placeholder="아이템명 입력"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />

      {suggestionOpen && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
          <Command>
            <CommandList>
              {inputValue.length > 1 && suggestions.length === 0 ? (
                <CommandEmpty className="flex flex-col gap-2 items-center py-4 text-sm text-gray-400 p-3">
                  <p className="text-center text-gray-500 text-xs">
                    검색 결과가 없습니다.
                  </p>
                  <Button variant="outline" size="sm">
                    아이템 등록 요청
                  </Button>
                </CommandEmpty>
              ) : (
                <CommandGroup heading="검색 결과">
                  {suggestions.map((s) => (
                    <CommandItem
                      key={s.id}
                      value={s.id}
                      onSelect={() => handleSelect(s)}
                    >
                      <Image
                        src={s.image || "/images/empty.png"}
                        alt=""
                        width={40}
                        height={48}
                      />
                      {s.name} ({s.item_gender})
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
