"use client";

import { Input } from "@/shared/ui/input";
import {
  ChangeEvent,
  useState,
  useMemo,
  InputHTMLAttributes,
  MouseEvent,
} from "react";
import debounce from "@/shared/lib/debounce";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { cn } from "@/shared/lib/utils";
import { useItemsInfoQuery } from "@/shared/hooks/useItemsInfoQuery";
import { useSearchItemQuery } from "@/shared/hooks/useSearchItemQuery";
import { SearchItemInfo } from "@/features/item/model/itemTypes";
import RequestItemModal from "@/features/item/ui/RequestItemModal";
import { Button } from "@/shared/ui/button";
import { Clock, X, Search } from "lucide-react";
import { logSearchKeywordAction } from "@/app/actions/search-actions";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  className?: string;
  isSearchMode?: boolean; // 검색/선택 모드
  onSearch?: (value: string) => void;
  onSelectSuggestion?: (suggestion: SearchItemInfo) => void;
}

const RECENT_SEARCHES_KEY = "recentSearches";
const MAX_RECENT_SEARCHES = 5;

export default function SearchInput({
  value,
  className,
  isSearchMode = true,
  onSearch,
  onSelectSuggestion,
  ...rest
}: SearchInputProps) {
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  // 최근 검색 기록
  const [recentSearches, setRecentSearches] = useState<SearchItemInfo[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("최근 검색 불러오기 실패:", error);
      return [];
    }
  });

  // 최근 검색 기록 삭제
  const removeRecentSearch = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s.id !== id);

      // localStorage에 검색 기록 삭제 반영
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("최근 검색 삭제 실패:", error);
      }

      return updated;
    });
  };

  // 아이템 목록 캐싱
  const { data: allItems = [] } = useItemsInfoQuery();

  // 검색 캐싱
  const { data: suggestions = [], refetch } = useSearchItemQuery(
    value,
    allItems
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        onSearch?.(val);
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
    // 선택 시 최근 검색에 추가 (중복 제거, 5개까지 표시)
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== s.id);
      const updated = [s, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      // localStorage에 저장
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("최근 검색 저장 실패:", error);
      }

      return updated;
    });

    onSearch?.(s.name);
    if (onSelectSuggestion) onSelectSuggestion(s);

    // 검색어 1점 증가
    if (isSearchMode) {
      logSearchKeywordAction(s.name, s.item_gender);
    }

    // 자동완성 닫기
    setSuggestionOpen(false);
  };

  const handleFocus = () => {
    if (value.length > 0) setSuggestionOpen(true);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="text"
        placeholder="아이템명 입력"
        value={value}
        className="bg-background hover:border-blue-300 focus:border-blue-300"
        onChange={handleChange}
        onFocus={handleFocus}
        {...rest}
      />
      <Search className="absolute text-blue-600 size-5 md:size-6 md:right-6 right-4 top-1/2 -translate-y-1/2 z-[1]" />

      {suggestionOpen && (
        <div className="command-wrap md:min-w-[450px] absolute left-0 right-0 top-full z-10 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
          <Command className="border rounded-lg">
            <CommandList>
              {value.length > 0 && suggestions.length === 0 ? (
                <CommandEmpty className="flex flex-col gap-2 items-center py-4 text-sm text-gray-400 p-3">
                  <p className="text-center text-gray-500 text-xs">
                    검색 결과가 없습니다.
                  </p>
                  <div className="flex gap-2">
                    <RequestItemModal itemName={value} />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setSuggestionOpen(false)}
                    >
                      닫기
                    </Button>
                  </div>
                </CommandEmpty>
              ) : (
                <div className="grid grid-cols-2 divide-x">
                  {/* 왼쪽: 자동 완성 목록 */}
                  <CommandGroup heading="검색 결과">
                    {suggestions.length > 0 ? (
                      suggestions.map((s) => (
                        <CommandItem
                          key={s.id}
                          value={s.id}
                          onSelect={() => handleSelect(s)}
                          className="flex items-center text-left text-xs md:text-sm gap-3 py-1 cursor-pointer"
                        >
                          <img
                            src={s.image || "/images/empty.png"}
                            alt=""
                            className="w-10 h-12 object-contain"
                          />
                          <span>
                            {s.name} ({s.item_gender})
                          </span>
                        </CommandItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-gray-400">
                        검색어를 입력하세요
                      </div>
                    )}
                  </CommandGroup>

                  {/* 오른쪽: 최근 검색 */}
                  <CommandGroup>
                    <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/50">
                        <Clock className="w-3.5 h-3.5" />
                        최근 검색(5개)
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto"
                        onClick={() => setSuggestionOpen(false)}
                      >
                        닫기
                      </Button>
                    </div>

                    {recentSearches && recentSearches.length > 0 ? (
                      recentSearches.map((s) => (
                        <CommandItem
                          key={s.id}
                          value={s.id}
                          onSelect={() => handleSelect(s)}
                          className="flex items-center text-left text-xs md:text-sm gap-3 py-1 cursor-pointer group"
                        >
                          <img
                            src={s.image || "/images/empty.png"}
                            alt=""
                            className="w-10 h-12 object-contain"
                          />
                          <div className="flex items-start gap-1">
                            <span>
                              {s.name} ({s.item_gender})
                            </span>
                            <button
                              onClick={(e) => removeRecentSearch(s.id, e)}
                            >
                              <X className="w-2 h-2 md:w-3 md:h-3 text-foreground/50" />
                            </button>
                          </div>
                        </CommandItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-gray-400">
                        검색 내역이 없습니다.
                      </div>
                    )}
                  </CommandGroup>
                </div>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
