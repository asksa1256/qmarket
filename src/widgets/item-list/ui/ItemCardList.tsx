// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
import ItemCard from "@/entities/item/ui/ItemCard";
import { getDailyItemCountAction } from "@/features/item-upload-modal/model/actions";
import { DAILY_LIMIT } from "@/shared/lib/redis";
import fetchFilteredItems from "@/entities/item/api/itemApi";

interface Props {
  userId: string;
  isForSale: boolean; // true: 판매 아이템 / false: 구매 아이템
  isSold: boolean; // 거래 완료 여부
}

export default async function ItemCardList({
  userId,
  isForSale,
  isSold,
}: Props) {
  // const [searchQuery, setSearchQuery] = useState("");
  // const [soldFilter, setSoldFilter] = useState<boolean | null>(null); // 판매 상태 필터

  // // 일일 등록 카운트
  // const { data: limitStatus, refetch: refetchLimitInfo } = useQuery({
  //   queryKey: ["dailyItemCount", userId],
  //   queryFn: getDailyItemCountAction,
  //   initialData: { count: 0, remaining: DAILY_LIMIT },
  // });

  let items;
  try {
    items = await fetchFilteredItems({ userId, isForSale, isSold });
  } catch (error) {
    return (
      <div className="text-sm text-gray-500">
        데이터를 불러오는 데 실패했습니다.
      </div>
    ); // 해당 컴포넌트만 대체
  }

  return (
    <div className="pb-10 grow">
      {/* 아이템 등록 가능 횟수 */}
      {/* <div className="flex justify-end mb-4">
        <DailyLimitDisplay remaining={limitStatus.remaining} />
      </div>

      {/* 안내 문구 */}
      {/* <div className="rounded-xl border p-4 mt-4">
        <p className="text-gray-500 text-sm">
          * <b>판매완료</b> 처리는 <b>아이템 수정</b>을 이용해주세요.
        </p>
      </div> */}

      {/* 아이템 리스트 */}
      <div className="flex flex-col h-[400px] overflow-auto rounded-2xl border border-border">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            등록된 아이템이 없습니다.
          </div>
        ) : (
          <>
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
