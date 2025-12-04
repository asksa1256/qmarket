"use client";

import { useState, useCallback } from "react";
import {
  getItemMarketPrice,
  getTradedMarketPrice,
} from "@/features/item/model/getItemMarketPrice";
import getItemImage from "@/features/item/model/getItemImage";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { Button } from "@/shared/ui/button";
import { Search } from "lucide-react";
import getItemSaleHistory, {
  SaleHistory,
} from "@/features/item/model/getItemSaleHistory";
import SaleHistoryChart from "@/features/market/ui/SaleHistoryChart";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import ItemImage from "@/shared/ui/ItemImage";

import Image from "next/image";
import CreateReportModal from "@/features/report/ui/CreateReportModal";
import { useUser } from "@/shared/hooks/useUser";

export default function MarketPriceDashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemGender, setItemGender] = useState("남");
  const [displayGender, setDisplayGender] = useState("남"); // 성별 선택 시 검색 결과 리렌더링 방지 (검색 버튼 클릭 시에만 리렌더링 용도)
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 시세 상태
  const [marketPrice, setMarketPrice] = useState({ price: 0, count: 0 }); // 현재 시세
  const [tradedPrice, setTradedPrice] = useState({ price: 0, count: 0 }); // 거래 시세

  // 거래 내역 상태
  const [saleHistory, setSaleHistory] = useState<SaleHistory[]>([]);

  const [recentSoldDate, setRecentSoldDate] = useState("");

  const { data: user } = useUser();

  const handleSearch = useCallback(async () => {
    const trimmedInput = searchInput.trim();
    if (!trimmedInput) {
      setMarketPrice({ price: 0, count: 0 });
      setTradedPrice({ price: 0, count: 0 });
      setSaleHistory([]);
      setSearchQuery(""); // 검색어도 초기화
      setItemImageUrl("");
      return;
    }

    setIsLoading(true);
    setSearchQuery(trimmedInput);
    setDisplayGender(itemGender); // 검색 시에만 성별 표시 업데이트

    try {
      const [market, traded, history, itemImage] = await Promise.all([
        getItemMarketPrice(trimmedInput, itemGender),
        getTradedMarketPrice(trimmedInput, itemGender),
        getItemSaleHistory(trimmedInput, itemGender),
        getItemImage(trimmedInput, itemGender),
      ]);

      setMarketPrice({ price: market.price, count: market.count });
      setTradedPrice({ price: traded.price, count: traded.count });
      setSaleHistory(history);
      setItemImageUrl(itemImage);

      if (history && history.length > 0) {
        const recentDate = new Date(history[history.length - 1].date);
        recentDate.setDate(recentDate.getDate());
        const recentKstDate = recentDate.toISOString().slice(0, 10);
        setRecentSoldDate(recentKstDate);
      } else {
        const today = new Date();
        const todayKstDate = today.toISOString().slice(0, 10);
        setRecentSoldDate(todayKstDate);
      }
    } catch (error) {
      console.error("시세 조회 오류:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchInput, itemGender]);

  const hasMarketPrice = marketPrice.price !== 0 && tradedPrice.price !== 0;

  return (
    <section className="max-w-6xl mx-auto">
      <div className="rounded-xl border p-4 mt-4">
        <p className="text-sm text-gray-500">
          * 아이템 이름, 아이템 성별을 입력하고 검색 버튼을 눌러주세요.
        </p>
        <p className="text-gray-500 text-sm">
          * 시세 조작이 의심될 경우, 우측 상단의 신고 버튼을 눌러 제보해주세요.
          (허위 신고를 방지하기 위해 로그인 후 신고 가능합니다.)
        </p>
      </div>

      {/* 검색창 */}
      <div className="flex flex-wrap flex-1 items-center justify-center mt-8 gap-4 md:gap-8">
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
            title="시세 검색하기"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSearch}
          >
            <Search />
            시세 검색
          </Button>
        </div>
      </div>

      {hasMarketPrice && (
        <div className="border-t mt-10 pb-10">
          <div className="inline-block mt-8 p-2 bg-gradient-to-b from-[#53A0DA] to-[#2359B6] border-1 border-[#002656] rounded-sm">
            <ItemImage
              name={searchInput}
              imgUrl={itemImageUrl || "/images/empty.png"}
              size="lg"
              className="border-1 border-[#002656] rounded-none"
            />
          </div>

          <h2 className="text-2xl font-bold mt-4 mb-4">
            <Image
              src="/images/money-bag.png"
              alt=""
              width={32}
              height={32}
              className="inline-block mr-1"
            />
            <span className="text-blue-600 mr-1">
              {searchQuery}({displayGender})
            </span>
            시세 조회
            {user && (
              <span className="ml-2">
                <CreateReportModal />
              </span>
            )}
          </h2>

          <div className="mb-8 md:mb-0">
            <p className="text-sm text-gray-500">
              * <b>현재 시세</b>: 현재 <b>판매중</b>인 아이템 가격 기준 (호가)
            </p>
            <p className="text-sm text-gray-500">
              * <b>거래 시세</b>: <b>판매 완료</b>된 아이템 가격 기준 (실거래가)
            </p>
            <p className="text-sm text-gray-500">
              * 시세는 거래 평균값이 아닙니다.
            </p>
          </div>

          {/* 시세 */}
          <ul className="mt-4 space-y-4 md:space-y-0">
            <li>
              - 현재 시세:
              {marketPrice.count === 0 ? (
                <b className="ml-1 text-gray-500">
                  판매중인 데이터가 없습니다.
                </b>
              ) : (
                <span className="ml-1 text-blue-600 text-3xl font-extrabold">
                  {isLoading
                    ? "계산 중..."
                    : Number(marketPrice.price).toLocaleString()}
                  원
                </span>
              )}
            </li>
            <li>
              - 거래 시세:
              {tradedPrice.count === 0 ? (
                <b className="ml-1 text-gray-500">거래 내역이 없습니다.</b>
              ) : (
                <>
                  <span className="ml-1 text-blue-600 text-3xl font-extrabold">
                    {isLoading
                      ? "계산 중..."
                      : Number(tradedPrice.price).toLocaleString()}
                    원
                  </span>
                  <b className="block md:inline-block ml-2 text-blue-500 text-sm">
                    *최근 거래 가격:{" "}
                    {Number(
                      saleHistory[saleHistory.length - 1].transactions[0].price
                    ).toLocaleString()}
                    원 ({recentSoldDate})
                  </b>
                </>
              )}
              {/* {tradedPrice.count > 0 && tradedPrice.count < 10 && (
                <p className="inline-block ml-1 text-sm text-gray-500">
                  (거래 내역이 10개 미만이므로 정확하지 않을 수 있습니다.)
                </p>
              )} */}
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
              <SaleHistoryChart data={saleHistory} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
