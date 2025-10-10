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
import { ITEMS_INFO_TABLE_NAME } from "@/shared/config/constants";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  className?: string;
  onSearch: (value: string) => void;
}

interface Suggestion {
  name: string;
  item_gender: string | null;
}

export default function SearchInput({
  value,
  className,
  onSearch,
  ...rest
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [allItems, setAllItems] = useState<Suggestion[]>([]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 전체 아이템 초기 로드
  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from(ITEMS_INFO_TABLE_NAME)
        .select("name, item_gender");
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
  }, [value]);

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        onSearch(val);

        if (!val.trim()) {
          setSuggestions([]);
          return;
        }

        const results = allItems.filter((item) => {
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
    if (!open) setSuggestionOpen(true);
  };

  const handleSelect = (name: string) => {
    setInputValue(name);
    onSearch(name);
    setSuggestionOpen(false);
  };

  const handleFocus = () => {
    setSuggestionOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setSuggestionOpen(false), 150);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="아이템명 검색"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
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
                      value={s.name}
                      onSelect={() => handleSelect(s.name)}
                    >
                      {s.name}({s.item_gender})
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
