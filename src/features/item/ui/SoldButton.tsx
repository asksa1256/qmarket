"use client";

import { Button } from "@/shared/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateItemToSold } from "../model/updateItemToSold";

interface SoldButtonProps {
  itemId: string;
  userId: string;
}

export default function SoldButton({ itemId, userId }: SoldButtonProps) {
  const queryClient = useQueryClient();

  const markAsSoldMutation = useMutation({
    mutationFn: () => updateItemToSold(itemId),

    onSuccess: async () => {
      toast.success("아이템이 판매 완료 처리되었습니다.");

      queryClient.invalidateQueries({ queryKey: ["my-items", userId] });
      queryClient.invalidateQueries({ queryKey: ["filtered-items", userId] });
    },
    onError: (err) => {
      toast.error(`판매 완료 처리 오류: ${err.message}`);
      console.error(err);
    },
  });

  const handleClick = () => {
    markAsSoldMutation.mutate();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={markAsSoldMutation.isPending}
      variant="default"
    >
      <CheckCircle2 />
      {markAsSoldMutation.isPending ? "처리 중..." : "판매완료"}
    </Button>
  );
}
