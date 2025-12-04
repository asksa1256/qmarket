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
import Image from "next/image";
import { SearchItemInfo } from "@/features/item/model/itemTypes";
import RequestItemModal from "@/features/item/ui/RequestItemModal";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  className?: string;
  onSearch?: (value: string) => void;
  onSelectSuggestion?: (suggestion: SearchItemInfo) => void;
}

export default function SearchInput({
  value,
  className,
  onSearch,
  onSelectSuggestion,
  ...rest
}: SearchInputProps) {
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  // 전체 아이템 캐싱
  const { data: allItems = [] } = useItemsQuery();

  // 검색 캐싱
  const { data: suggestions = [], refetch } = useSearchItemQuery(
    value,
    allItems
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        onSearch?.(val);
        // refetch(); // React Query 검색 수행
      }, 300),
    [refetch]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onSearch?.(val); // 즉시 부모에게 값 전달 (실시간 업데이트)
    debouncedSearch(val); // debounced 검색도 수행

    if (!suggestionOpen && val.length > 0) setSuggestionOpen(true);
    if (suggestionOpen && val.length === 0) setSuggestionOpen(false);
  };

  const handleSelect = (s: SearchItemInfo) => {
    onSearch?.(s.name);
    if (onSelectSuggestion) onSelectSuggestion(s);
    setSuggestionOpen(false);
  };

  const handleFocus = () => {
    if (value.length > 0) setSuggestionOpen(true);
  };

  // const handleBlur = () => {
  //   setTimeout(() => setSuggestionOpen(false), 150);
  // };

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="text"
        placeholder="아이템명 입력"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        // onBlur={handleBlur}
        {...rest}
      />

      {suggestionOpen && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
          <Command>
            <CommandList>
              {value.length > 1 && suggestions.length === 0 ? (
                <CommandEmpty className="flex flex-col gap-2 items-center py-4 text-sm text-gray-400 p-3">
                  <p className="text-center text-gray-500 text-xs">
                    검색 결과가 없습니다.
                  </p>
                  <RequestItemModal itemName={value} />
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
