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
import { useItemsQuery } from "../model/useItemsQuery";
import { useSearchItemQuery } from "../model/useSearchItemQuery";
import { Button } from "@/shared/ui/button";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  className?: string;
  onSearch: (value: string) => void;
  onSelectSuggestion?: (suggestion: Suggestion) => void;
}

export interface Suggestion {
  id: number;
  name: string;
  item_gender: string | null;
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
    [refetch, onSearch]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
    if (!open && inputValue.length > 0) setSuggestionOpen(true);
  };

  const handleSelect = (s: Suggestion) => {
    setInputValue(s.name);
    onSearch(s.name);
    if (onSelectSuggestion) onSelectSuggestion(s);
    setSuggestionOpen(false);
  };

  const handleFocus = () => {
    setSuggestionOpen(true);
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
              {inputValue.length > 0 && suggestions.length === 0 ? (
                <CommandEmpty className="text-sm text-gray-400 flex items-center p-3">
                  검색 결과가 없습니다.
                </CommandEmpty>
              ) : (
                <CommandGroup heading="검색 결과">
                  {suggestions.map((s, idx) => (
                    <CommandItem
                      key={idx}
                      value={s.id.toString()}
                      onSelect={() => handleSelect(s)}
                    >
                      {s.name} ({s.item_gender})
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <div className="flex flex-col gap-2 items-center py-4">
                <p className="text-center text-gray-500 text-xs">
                  찾는 아이템이 없다면?
                </p>
                <Button variant="outline" size="sm">
                  아이템 등록 요청
                </Button>
              </div>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
