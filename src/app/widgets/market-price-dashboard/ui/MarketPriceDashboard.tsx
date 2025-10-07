"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getItemMarketPrice,
  getTradedMarketPrice,
} from "@/shared/lib/getItemMarketPrice";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { Button } from "@/shared/ui/button";
import { Search } from "lucide-react";
import getItemSaleHistory, {
  SaleHistory,
} from "@/shared/lib/getItemSaleHistory";
import SaleHistoryChart from "@/widgets/sale-history-chart/ui/SaleHistoryChart";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

export default function MarketPriceDashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemGender, setItemGender] = useState("남");
  const [isLoading, setIsLoading] = useState(false);

  // 시세 상태
  const [marketPrice, setMarketPrice] = useState(""); // 현재 시세
  const [tradedPrice, setTradedPrice] = useState(""); // 거래 시세

  // 거래 내역 상태
  const [saleHistory, setSaleHistory] = useState<SaleHistory[]>([]);

  const handleSearch = useCallback(async () => {
    const trimmedInput = searchInput.trim();
    if (!trimmedInput) {
      setMarketPrice("");
      setTradedPrice("");
      setSaleHistory([]);
      setSearchQuery(""); // 검색어도 초기화
      return;
    }

    setIsLoading(true);
    setSearchQuery(trimmedInput);

    try {
      const [market, traded, history] = await Promise.all([
        getItemMarketPrice(trimmedInput, itemGender),
        getTradedMarketPrice(trimmedInput, itemGender),
        getItemSaleHistory(trimmedInput, itemGender),
      ]);

      setMarketPrice(market);
      setTradedPrice(traded);
      setSaleHistory(history);
    } catch (error) {
      console.error("시세 조회 오류:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchInput, itemGender]);

  const hasMarketPrice = marketPrice !== "" && tradedPrice !== "";

  // itemGender 변경 후, searchQuery가 존재하면 자동 재조회
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    }
  }, [itemGender, handleSearch, searchQuery]);

  return (
    <section className="max-w-4xl mx-auto">
      <div className="mt-3">
        <p className="text-sm text-gray-500">
          * 최근 판매 내역 50개까지의 데이터를 기준으로 계산합니다.
        </p>
        <p className="text-sm text-gray-500">
          * <b>등록 건수 10개 이상</b>일 경우, <b>상하위 5%를 제외한 평균값</b>
          이 적용됩니다.
        </p>
        <p className="text-sm text-gray-500">
          * <b>등록 건수 10개 미만</b>일 경우, 대체 시세로 <b>중간값</b>이
          적용됩니다. (일부 극단값 영향 최소화)
          <span className="text-sm text-gray-400 block ml-4">
            * 예시: [5000, 100000, 129000, 130000, 150000]의 시세 = 129000
            (중간값)
          </span>
        </p>
      </div>

      {/* 검색창 */}
      <div className="flex flex-1 items-center justify-center mt-8 gap-8">
        {/* 성별 선택 */}
        <div className="flex items-center justify-center">
          <RadioGroup
            defaultValue="남"
            onValueChange={(value) => setItemGender(value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="남" id="male" />
              <label htmlFor="male">남</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="여" id="female" />
              <label htmlFor="female">여</label>
            </div>
          </RadioGroup>
        </div>

        {/* 검색바 */}
        <div className="flex gap-2">
          <SearchInput
            value={searchInput}
            className="text-sm w-auto"
            onSearch={(e: string) => setSearchInput(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Button
            size="icon"
            title="시세 검색하기"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSearch}
          >
            <Search />
          </Button>
        </div>
      </div>

      {hasMarketPrice && (
        <div className="border-t mt-10 pb-10">
          <h2 className="text-2xl font-bold pt-8 mb-4">
            💰{" "}
            <span className="text-blue-600 mr-1">
              {searchQuery}({itemGender})
            </span>
            시세 조회
          </h2>

          <p className="text-sm text-gray-500">
            * <b>현재 시세</b>: 현재 <b>판매중</b>인 가격 기준
          </p>
          <p className="text-sm text-gray-500">
            * <b>거래 시세</b>: <b>판매 완료</b>된 가격 기준 (실거래가)
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
                  : Number(tradedPrice).toLocaleString()}
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
              <SaleHistoryChart
                data={saleHistory}
                itemName={searchQuery}
                itemGender={itemGender}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
