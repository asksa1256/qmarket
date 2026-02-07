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
import Image from "next/image";
import { ItemTransactionConfirm } from "../model/itemTypes";
import { MouseEvent } from "react";

export default function ItemTransactionConfirmModal({
  itemId,
  itemName,
  itemGender,
  userId,
  isForSale,
}: ItemTransactionConfirm) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const forSaleText = isForSale ? "판매" : "구매";

  // 거래 인증 이미지 url
  const [transactionImageUrl, setTransactionImageUrl] = useState("");
  // 거래 인증 이미지 미리보기
  const [preview, setPreview] = useState("");

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      // 파일 선택 시 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  const handleImageUpload = (imgUrl: string) => {
    setTransactionImageUrl(imgUrl);
  };

  const markAsSoldMutation = useMutation({
    // 클로저로 인해 transactionImageUrl의 최신값이 누락되는 현상을 방지하고자 imgUrl만 따로 매개변수로 전달
    mutationFn: (imgUrl?: string) =>
      updateItemToSold(itemId, isForSale, imgUrl),
    onSuccess: async () => {
      toast.success(`${forSaleText} 완료 처리되었습니다.`);

      // 성공했을 때만 모달 닫기
      setIsOpen(false);

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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setPreview("");
      setTransactionImageUrl("");
    }
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    // 이미지는 골랐는데 업로드 버튼을 안 눌렀을 경우
    if (preview && !transactionImageUrl) {
      e.preventDefault(); // 폼 제출 기본 동작(모달 닫기) 방지
      toast.error("이미지 등록 버튼을 먼저 눌러주세요.");
      return;
    }

    e.preventDefault(); // 성공 전까지 모달 닫기 방지
    markAsSoldMutation.mutate(transactionImageUrl);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
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
            <b className="text-blue-600">
              {itemName}({itemGender})
            </b>
            <p>{forSaleText} 완료 처리하시겠습니까?</p>
          </AlertDialogTitle>
          <AlertDialogDescription>
            * 거래 인증 이미지를 등록하시면 신뢰도가 상승합니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <h4 className="font-medium text-sm">거래 인증 이미지 등록</h4>
            <p className="text-xs text-blue-500">
              * 이미지 업로드 후 [인증 등록] 버튼을 눌러주세요!
            </p>
          </div>

          <TransactionImageUploader
            onFileChange={handleFileChange}
            onUpload={handleImageUpload}
          />

          {preview && (
            <div className="flex flex-col gap-1 mt-2">
              <h4 className="font-medium text-sm">이미지 미리보기</h4>
              <div className="relative w-full h-32 rounded-md overflow-hidden border border-gray-300">
                <Image
                  src={preview}
                  alt="거래 인증 이미지 미리보기"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={markAsSoldMutation.isPending}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={markAsSoldMutation.isPending}
            onClick={handleSubmit}
          >
            {markAsSoldMutation.isPending ? "처리 중..." : "완료하기"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
