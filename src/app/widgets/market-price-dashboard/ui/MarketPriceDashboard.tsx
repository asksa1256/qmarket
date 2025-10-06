"use client";

import { useState, useCallback } from "react";
import getItemMarketPrice from "@/shared/lib/getItemMarketPrice";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { Button } from "@/shared/ui/button";
import { Search } from "lucide-react";

export default function MarketPriceDashboard() {
  const [marketPrice, setMarketPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(() => {
    const trimmedInput = searchQuery.trim();
    if (trimmedInput) {
      setSearchQuery(trimmedInput);
      setIsLoading(true);
      getItemMarketPrice(trimmedInput)
        .then(setMarketPrice)
        .finally(() => setIsLoading(false));
    } else {
      setSearchQuery("");
      setIsLoading(false);
    }
  }, [searchQuery]);

  const hasMarketPrice = marketPrice !== "";

  return (
    <section className="max-w-4xl mx-auto">
      <div>
        <p className="text-sm text-gray-500 mt-3">
          * 등록 건수 10개 이상일 경우, 상하위 5%를 제외한 평균(트림 평균)으로
          계산됩니다.
        </p>
        <p className="text-sm text-gray-500">
          * 등록 건수가 10개 미만일 경우, 중앙값이 대체 시세로 표시됩니다.
          (정확도는 다소 떨어질 수 있습니다.)
          <span className="text-sm text-gray-400 block ml-4">
            * 중앙값: 등록된 매물 개수(최대 10개) / 2
          </span>
        </p>
      </div>

      {/* 검색창 */}
      <div className="flex flex-1 justify-center mt-8 gap-2">
        <SearchInput
          value={searchQuery}
          className="border border-gray-300 rounded-lg shadow-sm text-sm w-auto"
          onSearch={(e: string) => setSearchQuery(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button size="icon" onClick={handleSearch}>
          <Search />
        </Button>
      </div>

      {hasMarketPrice && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            {searchQuery} 시세:{" "}
            <span className="text-blue-600 text-3xl font-extrabold">
              {isLoading ? "계산 중..." : Number(marketPrice).toLocaleString()}
              원
            </span>
          </h2>
        </div>
      )}
    </section>
  );
}
