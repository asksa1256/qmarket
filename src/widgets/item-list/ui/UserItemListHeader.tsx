"use client";

import { useQuery } from "@tanstack/react-query";
import ItemUploadModal from "@/features/item-upload-modal/ui/ItemUploadModal";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";
import { getDailyItemCountAction } from "@/features/item-upload-modal/model/actions";
import { DAILY_LIMIT } from "@/shared/lib/redis";
import DailyLimitDisplay from "@/features/item-upload-modal/ui/DailyLimitDisplay";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import PurchaseItemUploadModal from "@/features/item-upload-modal/ui/PurchaseItemUploadModal";

export default function UserItemListHeader({ userId }: { userId: string }) {
  // 일일 등록 카운트
  // const {
  //   data: limitStatus,
  //   refetch: refetchLimitInfo,
  //   refetch,
  // } = useQuery({
  //   queryKey: ["dailyItemCount", userId],
  //   queryFn: getDailyItemCountAction,
  //   initialData: { count: 0, remaining: DAILY_LIMIT },
  // });

  return (
    <div className="w-full mb-4">
      <ButtonToMain />

      {/* 판매 아이템 등록 가능 횟수 */}
      {/* <div className="flex justify-end mb-4">
        <DailyLimitDisplay remaining={limitStatus.remaining} />
      </div> */}

      <div className="mt-2 w-full text-right flex gap-2 justify-end">
        <ItemUploadModal
          onSuccess={() => {
            // refetchLimitInfo();
            // refetch();
          }}
        />
        <PurchaseItemUploadModal />
      </div>
    </div>
  );
}
