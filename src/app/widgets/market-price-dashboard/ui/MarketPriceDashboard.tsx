"use client";

import { useState, useCallback } from "react";
import getItemMarketPrice from "@/shared/lib/getItemMarketPrice";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { Button } from "@/shared/ui/button";
import { Search } from "lucide-react";
import getItemSaleHistory, {
  SaleHistory,
} from "@/shared/lib/getItemSaleHistory";
import SaleHistoryChart from "@/widgets/sale-history-chart/ui/SaleHistoryChart";

export default function MarketPriceDashboard() {
  const [marketPrice, setMarketPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 판매 완료 내역 상태
  const [saleHistory, setSaleHistory] = useState<SaleHistory[]>([]);

  const handleSearch = useCallback(() => {
    const trimmedInput = searchQuery.trim();
    if (trimmedInput) {
      // 검색어, 로딩 상태 업데이트
      setSearchQuery(trimmedInput);
      setIsLoading(true);

      // 시세 조회
      getItemMarketPrice(trimmedInput)
        .then(setMarketPrice)
        .finally(() => setIsLoading(false));

      // 판매 완료 내역 조회
      getItemSaleHistory(trimmedInput)
        .then(setSaleHistory)
        .catch((error) => console.error("판매 내역 조회 오류:", error));
    } else {
      setSearchQuery("");
      setMarketPrice("");
      setSaleHistory([]);
      setIsLoading(false);
    }
  }, [searchQuery]);

  const hasMarketPrice = marketPrice !== "";

  return (
    <section className="max-w-4xl mx-auto">
      <div className="mt-3">
        <p className="text-sm text-gray-500">
          * 최근 판매 내역 100개까지의 데이터를 기준으로 계산합니다.
        </p>
        <p className="text-sm text-gray-500">
          * 등록 건수 10개 이상일 경우, 상하위 5%를 제외한 평균(트림 평균)으로
          계산됩니다.
        </p>
        <p className="text-sm text-gray-500">
          * 등록 건수 10개 미만일 경우, 대체 시세로 중앙값이 표시됩니다.
          (정확도가 떨어질 수 있습니다.)
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
        <div className="border-t mt-10 pb-10">
          <h2 className="text-2xl font-bold pt-8 mb-4">
            💰 <span className="text-blue-600 mr-1">{searchQuery}</span>
            시세 조회
          </h2>

          <p className="text-sm text-gray-500">
            * 현재 시세: 현재 판매중인 가격 기준
          </p>
          <p className="text-sm text-gray-500">
            * 거래 시세: 판매 완료된 가격 기준 (정확도가 더 높습니다.)
          </p>

          {/* 시세 */}
          <ul className="mt-4">
            <li>
              - 현재 시세:{" "}
              <span className="ml-1 text-blue-600 text-3xl font-extrabold">
                {isLoading
                  ? "계산 중..."
                  : Number(marketPrice).toLocaleString()}
                원
              </span>
            </li>
            <li>
              - 거래 시세:{" "}
              <span className="ml-1 text-blue-600 text-3xl font-extrabold">
                {isLoading
                  ? "계산 중..."
                  : Number(marketPrice).toLocaleString()}
                원
              </span>
            </li>
          </ul>

          {/* 거래 내역 차트 */}
          <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-bold pb-2">📈 일별 거래 내역</h3>
            <p className="text-gray-500 text-sm mb-4">
              * 일별 판매 평균값이 표시되며, 마우스를 올리면 상세 내역이
              표시됩니다.
            </p>
            <div className="p-4 border border-gray-200 rounded-lg shadow-inner bg-white">
              <SaleHistoryChart data={saleHistory} itemName={searchQuery} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
