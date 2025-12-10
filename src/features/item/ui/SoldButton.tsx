"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import ItemTransactionConfirmModal from "./ItemTransactionConfirmModal";

interface SoldButtonProps {
  itemId: number;
  userId: string;
  isForSale: boolean;
}

export default function SoldButton({
  itemId,
  userId,
  isForSale,
}: SoldButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ItemTransactionConfirmModal
          itemId={itemId}
          userId={userId}
          isForSale={isForSale}
        />
      </TooltipTrigger>
      <TooltipContent>{isForSale ? "판매완료" : "구매완료"}</TooltipContent>
    </Tooltip>
  );
}
