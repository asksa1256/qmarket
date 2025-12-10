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
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/shared/api/supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";
import { restoreDailyItemCountAction } from "@/app/actions/item-actions";

interface Props {
  itemId: number;
  userId: string;
}

export function ItemDeleteModal({ itemId, userId }: Props) {
  const queryClient = useQueryClient();

  const deleteItemMutation = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("로그인이 필요합니다.");
      }

      const { error } = await supabase
        .from(ITEMS_TABLE_NAME)
        .delete()
        .eq("id", itemId)
        .eq("user_id", user.id);

      if (error) throw new Error(error.message);

      // 아이템 등록 횟수 1회 복구
      try {
        await restoreDailyItemCountAction(userId);
      } catch (redisError) {
        console.error("Redis count update failed:", redisError);
      }

      return itemId;
    },

    onSuccess: () => {
      toast.success("아이템을 삭제했습니다.");
      queryClient.invalidateQueries({ queryKey: ["my-items", userId] });
      queryClient.invalidateQueries({ queryKey: ["filtered-items", userId] });
      queryClient.invalidateQueries({
        queryKey: ["item-create-limit-count", userId],
      });
    },

    onError: (err) => {
      toast.error("삭제에 실패했습니다.");
      console.error(err);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="gap-1.5 text-xs"
          aria-label="아이템 삭제"
          title="아이템 삭제"
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>아이템을 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            한번 삭제한 아이템은 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteItemMutation.isPending}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteItemMutation.isPending}
            onClick={() => deleteItemMutation.mutate()}
          >
            {deleteItemMutation.isPending ? "삭제 중..." : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
