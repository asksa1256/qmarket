"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui/tooltip";
import { toast } from "sonner";
import { Lock, Plus } from "lucide-react";
import { useUser } from "@/shared/hooks/useUser";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDailyItemCountAction } from "@/app/actions/item-actions";
import { ItemDetail } from "@/features/item/ui/ItemDetailClient";
import DirectPriceCreateForm from "./DirectPriceCreateForm";

export default function DirectPriceCreateModal({
  initialItem,
}: {
  initialItem?: ItemDetail;
}) {
  const [open, setOpen] = useState(false);
  const { data: user } = useUser();

  // 일일 등록 잔여 횟수 조회
  const { data: limitStatus, isPending } = useQuery({
    queryKey: ["item-create-limit-count", user?.id],
    queryFn: getDailyItemCountAction,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  // 잔여 횟수 조회중이거나, 로그인 상태가 아니거나, remaining이 0 이하면 disabled
  const isDisabled = !user || isPending || (limitStatus?.remaining ?? 0) <= 0;

  const handleModalOpen = () => {
    if (user) {
      setOpen(true);
    } else {
      setOpen(false);
      toast.error("로그인이 필요합니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {user ? (
        <Button
          variant="default"
          className="w-auto font-bold bg-blue-600 hover:bg-blue-700"
          disabled={isDisabled}
          onClick={handleModalOpen}
        >
          <Plus /> 시세 바로 등록
        </Button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="default"
                className="w-full font-bold bg-blue-600 hover:bg-blue-700"
                disabled={isDisabled}
                onClick={handleModalOpen}
              >
                <Lock /> 시세 바로 등록
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>로그인이 필요합니다.</TooltipContent>
        </Tooltip>
      )}

      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <DialogTitle>시세 바로 등록</DialogTitle>
          <DialogDescription className="flex flex-col">
            * 거래 완료 인증샷이 없을 경우 등록되지 않습니다.
            <br />* 시세 입력 시 일일 등록 횟수가 동일하게 차감됩니다.
          </DialogDescription>
        </DialogHeader>

        <DirectPriceCreateForm />
      </DialogContent>
    </Dialog>
  );
}
