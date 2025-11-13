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
import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { Item } from "@/entities/item/model/types";

interface Props {
  itemId: string;
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
        .from("items")
        .delete()
        .eq("id", itemId)
        .eq("user_id", user.id);

      if (error) throw new Error(error.message);
      return itemId;
    },

    // 성공 시 캐시 동기화 (UI 즉시 반영)
    onSuccess: (deletedId) => {
      toast.success("아이템을 삭제했습니다.");

      queryClient.setQueryData<InfiniteData<Item[]>>(
        ["my-items", userId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.filter((i) => i.id !== deletedId)
            ),
          };
        }
      );
    },

    onError: (err) => {
      toast.error("삭제에 실패했습니다.");
      console.error(err);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" title="삭제하기">
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
