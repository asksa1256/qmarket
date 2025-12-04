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
import { supabase } from "@/shared/api/supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/shared/hooks/useUser";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui/tooltip";

interface RequestItemModalProps {
  itemName: string;
  itemGender: string;
}

export default function RequestItemModal({
  itemName,
  itemGender,
}: RequestItemModalProps) {
  const { data: user } = useUser();

  return (
    <AlertDialog>
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
              {itemName}({itemGender})
            </span>
            <br /> 아이템을 등록 요청하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogDescription>
            요청하신 아이템은 확인 절차를 거쳐 등록되므로
            <br />
            다소 시간이 소요될 수 있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
          // disabled={deleteItemMutation.isPending}
          // onClick={() => deleteItemMutation.mutate()}
          >
            {/* {deleteItemMutation.isPending ? "요청 중..." : "등록 요청"} */}
            등록 요청
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
