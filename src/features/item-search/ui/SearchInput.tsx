"use client";

import { Input } from "@/shared/ui/input";
import {
  ChangeEvent,
  useEffect,
  useState,
  useMemo,
  InputHTMLAttributes,
} from "react";
import debounce from "@/shared/lib/debounce";
import { supabase } from "@/shared/api/supabase-client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { ItemCategory } from "@/entities/item/model/types";
import { cn } from "@/shared/lib/utils";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  className?: string;
  onSearch: (value: string) => void;
  onSelectSuggestion?: (suggestion: Suggestion) => void;
}

interface Suggestion {
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [allItems, setAllItems] = useState<Suggestion[]>([]);

  useEffect(() => {
    // 전체 아이템 초기 로드
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("items_info")
        .select("id, name, item_gender");

      if (!error && data) {
        setAllItems(data);
      } else {
        console.error(error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    setInputValue(value);

    if (value) {
      const matched = allItems.find(
        (item) => item.name === value && item.item_gender === value
      );
      if (matched) {
        setSuggestions([matched]);
      }
    }
  }, [value, allItems]);

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        onSearch(val);

        if (!val.trim()) {
          setSuggestions([]);
          return;
        }

        const results = allItems.filter((item) => {
          if (item.name === val) return true; // 완전 일치할 경우, true 리턴
          const nameChars = item.name.split(""); // 아이템 이름 글자 배열
          const inputChars = val.split(""); // 입력값 글자 배열

          return inputChars.every((c) => nameChars.includes(c));
        });

        setSuggestions(results);
      }, 300),
    [allItems, onSearch]
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
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
