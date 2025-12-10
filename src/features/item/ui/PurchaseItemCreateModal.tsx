"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { toast } from "sonner";
import { Lock, Plus } from "lucide-react";
import { useUser } from "@/shared/hooks/useUser";
import { useState } from "react";
import { getDailyItemCountAction } from "@/app/actions/item-actions";
import ItemForm from "./ItemForm";
import { useQuery } from "@tanstack/react-query";

export default function PurchaseItemCreateModal() {
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

  const handleItemUploadOpen = () => {
    if (user) {
      setOpen(true);
    } else {
      setOpen(false);
      toast.error("로그인이 필요합니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="default"
        className="w-auto font-bold bg-blue-600 hover:bg-blue-700"
        disabled={isDisabled}
        onClick={handleItemUploadOpen}
      >
        {user ? <Plus /> : <Lock />} 구매 아이템 등록
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>구매 아이템 등록</DialogTitle>
          <DialogDescription className="flex flex-col">
            가격 제시 요청 시 경고 대상이 될 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <ItemForm
          isForSale={false}
          onSuccess={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
