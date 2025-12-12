import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Button } from "@/shared/ui/button";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItemToSold } from "../model/updateItemToSold";
import { useState } from "react";
import TransactionImageUploader from "@/features/market/ui/TransactionImageUploader";

interface Props {
  itemId: number;
  userId: string;
  isForSale: boolean;
}

export default function ItemTransactionConfirmModal({
  itemId,
  userId,
  isForSale,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const forSaleText = isForSale ? "판매" : "구매";

  // 거래 인증 이미지 url
  const [transactionImageUrl, setTransactionImageUrl] = useState("");

  const markAsSoldMutation = useMutation({
    mutationFn: () => updateItemToSold(itemId, isForSale, transactionImageUrl),
    onSuccess: async () => {
      toast.success(`${forSaleText} 완료 처리되었습니다.`);

      queryClient.invalidateQueries({ queryKey: ["items", userId] });
      queryClient.invalidateQueries({ queryKey: ["my-items", userId] });
      queryClient.invalidateQueries({ queryKey: ["filtered-items"] });
      queryClient.invalidateQueries({ queryKey: ["item-sale-history"] });
      queryClient.invalidateQueries({
        queryKey: ["user-transaction-counts", userId],
      });
    },
    onError: (err) => {
      toast.error(`${forSaleText} 처리 오류: ${err.message}`);
      console.error(err);
    },
  });

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              disabled={markAsSoldMutation.isPending}
              variant="default"
              size="icon"
            >
              <CheckCircle2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isForSale ? "판매완료" : "구매완료"}</TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {forSaleText} 완료 처리하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogDescription>
            * 거래 인증 이미지를 등록하시면 신뢰도가 상승합니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-sm">거래 인증 이미지 등록</h4>
          <TransactionImageUploader onUpload={setTransactionImageUrl} />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={markAsSoldMutation.isPending}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={markAsSoldMutation.isPending}
            onClick={() => markAsSoldMutation.mutate()}
          >
            {markAsSoldMutation.isPending ? "처리 중..." : "완료하기"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
