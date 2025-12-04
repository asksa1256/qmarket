"use client";

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
import { Button } from "@/shared/ui/button";
import { Plus, Lock } from "lucide-react";
import { toast } from "sonner";
import { createItemRequest } from "../model/createItemRegRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/shared/hooks/useUser";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui/tooltip";
import { useState } from "react";

export default function RequestItemModal({ itemName }: { itemName: string }) {
  const { data: user } = useUser();
  const [gender, setGender] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const createRequestMutation = useMutation({
    mutationFn: createItemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemRequests"] });
      setOpen(false);
      setGender("");
      toast.success("아이템 등록 요청이 완료되었습니다.");
    },
    onError: (error) => {
      console.error("아이템 등록 요청 실패:", error);
      toast.error("아이템 등록 요청에 실패했습니다.");
    },
  });

  const handleSubmit = () => {
    if (!gender) {
      alert("성별을 선택해주세요.");
      return;
    }

    if (!user?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    createRequestMutation.mutate({
      itemName,
      gender,
      userId: user.id,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {user ? (
          <Button>
            <Plus /> 아이템 등록 요청
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block">
                <Button disabled>
                  <Lock /> 아이템 등록 요청
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>로그인이 필요합니다.</TooltipContent>
          </Tooltip>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="text-blue-600">
              {itemName}
              {gender && <>({gender})</>}
            </span>
            <br /> 아이템을 등록 요청하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogDescription>
            요청하신 아이템은 확인 절차를 거쳐 등록되므로
            <br />
            다소 시간이 소요될 수 있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-4 items-center justify-center">
          <label htmlFor="item_gender" className="text-sm font-medium">
            아이템 성별:
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={gender === "남" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setGender("남")}
            >
              남
            </Button>
            <Button
              type="button"
              variant={gender === "여" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setGender("여")}
            >
              여
            </Button>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={createRequestMutation.isPending || !gender}
            onClick={handleSubmit}
          >
            {createRequestMutation.isPending ? "요청 중..." : "등록 요청"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
