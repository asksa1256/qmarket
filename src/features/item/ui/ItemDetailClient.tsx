"use client";

import { useQuery } from "@tanstack/react-query";
import SaleHistoryChart from "@/features/market/ui/SaleHistoryChart";
import getItemSaleHistory from "@/features/item/model/getItemSaleHistory";
import {
  ItemGender,
  ItemCategory,
  ItemSource,
} from "@/features/item/model/itemTypes";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";
import ItemList from "@/features/items/ui/ItemList";
import ItemsFilter from "@/features/item-search/ui/ItemsFilter";
import { useState } from "react";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import SectionTitle from "@/shared/ui/SectionTitle";
import SellingItemCreateModal from "./SellingItemCreateModal";
import PurchaseItemCreateModal from "./PurchaseItemCreateModal";
import { Badge } from "@/shared/ui/badge";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FilterParams } from "@/features/item-search/model/filterTypes";

export interface ItemDetail {
  id: string;
  name: string;
  item_gender: ItemGender;
  image: string | null;
  category: ItemCategory;
  item_source: ItemSource;
  rotation_date?: string;
  rotation_degree?: number;
}

interface ItemDetailProps {
  item: ItemDetail;
  marketPrice: number; // 판매 희망가 (호가)
  desiredPrice: number; // 구매 희망가
}

export default function ItemDetailClient({
  item,
  marketPrice,
  desiredPrice,
}: ItemDetailProps) {
  const [filterParams, setFilterParams] = useState<FilterParams>({
    sortBy: "updated_at",
    sortOrder: "desc",
  });

  const { data: saleHistory, isPending } = useQuery({
    queryKey: ["item-sale-history", item.name, item.item_gender],
    queryFn: () => getItemSaleHistory(item.name, item.item_gender),
  });

  return (
    <section className="w-full lg:max-w-6xl mx-auto">
      <ButtonToBack />

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* 아이템 정보 */}
        <div className="w-full lg:w-64 order-1 lg:order-1 lg:shrink-0">
          <div className="rounded-xl lg:sticky lg:top-20">
            <SectionTitle>아이템 정보</SectionTitle>

            <div className="flex flex-col items-center">
              <img
                src={item.image || "/images/empty.png"}
                alt={item.name}
                className="w-36 h-40 object-cover rounded-xl border border-gray-200 p-1 mb-4"
              />

              <h1 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">
                {item.name}({item.item_gender})
              </h1>

              <ul className="w-full space-y-2 text-foreground/70 text-sm">
                <li className="flex justify-between border-b pb-1 last:border-b-0">
                  <span className="font-semibold">출처:</span>
                  <span>
                    {item.item_source ? item.item_source : "미등록"}{" "}
                    {item.rotation_date && (
                      <em className="text-xs not-italic">
                        (로테이션: {item.rotation_date}
                        {item.rotation_degree && (
                          <Badge
                            variant="secondary"
                            className="ml-1 px-1 py-0 text-[11px] rounded-xs"
                          >
                            {item.rotation_degree}차
                          </Badge>
                        )}
                        )
                      </em>
                    )}
                  </span>
                </li>
                <li className="flex justify-between border-b pb-1 last:border-b-0">
                  <span className="font-semibold">판매 희망가:</span>
                  <div>
                    {marketPrice === 0 ? (
                      <span className="text-[12px]">
                        등록된 데이터가 없습니다.
                      </span>
                    ) : (
                      <span>
                        {`${marketPrice.toLocaleString("ko-KR")}원`}{" "}
                        <span className="ml-1 text-[11px] text-foreground/50">
                          (최근 10건)
                        </span>
                      </span>
                    )}
                  </div>
                </li>
                <li className="flex justify-between border-b pb-1 last:border-b-0">
                  <span className="font-semibold">구매 희망가:</span>
                  <div>
                    {desiredPrice === 0 ? (
                      <span className="text-[12px]">
                        등록된 데이터가 없습니다.
                      </span>
                    ) : (
                      <span>
                        {`${desiredPrice.toLocaleString("ko-KR")}원`}{" "}
                        <span className="ml-1 text-[11px] text-foreground/50">
                          (최근 10건)
                        </span>
                      </span>
                    )}
                  </div>
                </li>
                <li className="flex flex-col gap-1 border-b pb-1 last:border-b-0">
                  <div className="flex justify-between">
                    <span className="font-semibold">최근 거래가:</span>
                    <span>
                      {saleHistory && saleHistory.length > 0 ? (
                        <h6>
                          {saleHistory[
                            saleHistory.length - 1
                          ].transactions[0].price.toLocaleString()}
                          원
                          <span className="ml-1 text-xs">
                            ({saleHistory[saleHistory.length - 1].date})
                          </span>
                        </h6>
                      ) : (
                        <span className="text-xs">
                          최근 거래 내역이 없습니다.
                        </span>
                      )}
                    </span>
                  </div>

                  <p className="text-foreground/50 text-xs break-keep">
                    * 아이템 시세는 참고용으로만 확인해주세요.{" "}
                    <Link
                      href="/faq"
                      className="inline-flex gap-0.5 items-center underline underline-offset-1 hover:text-foreground/70"
                    >
                      FAQ <ExternalLink className="size-2.5" />
                    </Link>
                  </p>
                </li>
                <li className="flex justify-between border-b pb-1 last:border-b-0">
                  <span className="font-semibold">카테고리:</span>
                  <span>{item.category}</span>
                </li>
              </ul>
            </div>

            {/* actions */}
            <div className="flex flex-col gap-1 mt-4">
              <SellingItemCreateModal initialItem={item} />
              <PurchaseItemCreateModal initialItem={item} />
            </div>
          </div>
        </div>

        {/* 아이템 팝니다/삽니다 목록 및 차트 */}
        <div className="flex-1 order-2 lg:order-2">
          <div className="flex flex-wrap md:flex-row gap-4">
            <ItemsFilter
              onFilterChange={(filters) => setFilterParams(filters)}
              className="w-full mb-4"
            />

            <div className="w-full md:w-[48%] grow shrink-0">
              <h3 className="md:text-lg font-bold mb-2 text-base">판매해요</h3>
              <ItemList
                itemName={item.name}
                itemGender={item.item_gender}
                isForSale={true}
                isSold={false}
                filterParams={filterParams}
              />
            </div>

            <div className="w-full md:w-[48%] grow shrink-0">
              <h3 className="md:text-lg font-bold mb-2 text-base">구매해요</h3>
              <ItemList
                itemName={item.name}
                itemGender={item.item_gender}
                isForSale={false}
                isSold={false}
                filterParams={filterParams}
              />
            </div>
          </div>

          <div className="flex flex-wrap md:flex-row gap-4">
            <div className="w-full md:w-[48%] grow shrink-0">
              <h3 className="md:text-lg font-bold mb-2 text-base">판매완료</h3>
              <ItemList
                itemName={item.name}
                itemGender={item.item_gender}
                isForSale={true}
                isSold={true}
              />
            </div>

            <div className="w-full md:w-[48%] grow shrink-0">
              <h3 className="md:text-lg font-bold mb-2 text-base">구매완료</h3>
              <ItemList
                itemName={item.name}
                itemGender={item.item_gender}
                isForSale={false}
                isSold={true}
              />
            </div>
          </div>

          {/* 거래 내역 차트 */}
          <div>
            <h3 className="md:text-lg font-bold mb-2 text-base">
              📈 거래 내역 차트
            </h3>
            {isPending ? (
              <LoadingSpinner />
            ) : (
              <SaleHistoryChart data={saleHistory ?? []} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
