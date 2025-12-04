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
import { getDailyItemCountAction } from "../model/server-actions";
import { DAILY_LIMIT } from "@/shared/api/redis";
import ItemForm from "./ItemForm";

export default function SellingItemCreateModal() {
  const [open, setOpen] = useState(false);
  const { data: user } = useUser();

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
        disabled={!user}
        onClick={handleItemUploadOpen}
      >
        {user ? <Plus /> : <Lock />} 판매 아이템 등록
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>판매 아이템 등록</DialogTitle>
          <DialogDescription className="flex flex-col">
            가격 제시 요청은 지양해주세요! 경고 대상이 될 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <ItemForm
          isForSale={true}
          onSuccess={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
