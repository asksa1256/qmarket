"use client";

import { useEffect, useState } from "react";
import getItemMarketPrice from "@/shared/lib/getItemMarketPrice";

export default function MarketPriceDashboard() {
  const [marketPrice, setMarketPrice] = useState<string | number>("로딩 중...");
  const itemName = "하트고글캡";

  useEffect(() => {
    getItemMarketPrice(itemName).then(setMarketPrice);
  }, []);

  return (
    <section className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{itemName} 시세 확인 💰</h2>

      <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
        <p className="mb-2 text-lg font-semibold">
          현재 시세:
          <span className="text-blue-600 text-3xl font-extrabold">
            {marketPrice.toLocaleString()}원
          </span>
        </p>

        <p className="text-sm text-gray-500 mt-3">
          * 등록 건수 10개 이상일 경우, 상하위 5%를 제외한 평균(트림 평균)으로
          계산됩니다.
        </p>
        <p className="text-sm text-gray-500">
          * 등록 건수가 10개 미만일 경우 중앙값(Median)이 대체 시세로
          표시됩니다.
        </p>
      </div>
    </section>
  );
}
