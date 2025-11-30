"use client";

import { use, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { supabase } from "@/shared/api/supabase-client";
import { sanitize } from "@/shared/lib/sanitize";
import {
  PurchaseItemUpdateFormSchema,
  PurchaseItemUpdateFormType,
} from "../model/schema";
import {
  ITEM_GENDER_MAP,
  ITEM_SOURCES_MAP,
  ITEM_CATEGORY_MAP,
} from "@/shared/config/constants";
import {
  Item,
  ItemGender,
  ItemSource,
  ItemCategory,
} from "@/features/item/model/itemTypes";
import { cn } from "@/shared/lib/utils";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";
import { useUser } from "@/shared/hooks/useUser";

type ItemEditModalType = Omit<Item, "nickname" | "image">;

interface ItemEditModalProps {
  item: ItemEditModalType;
}

export default function ItemEditModal({ item }: ItemEditModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const form = useForm<PurchaseItemUpdateFormType>({
    resolver: zodResolver(PurchaseItemUpdateFormSchema),
    defaultValues: {
      item_name: item.item_name,
      price: item.price,
      message: "",
      item_source: "gatcha", // 필수 필드 추가
      item_gender: "w", // 필수 필드 추가
      category: "clothes", // 필수 필드 추가
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const updateItemMutation = useMutation({
    mutationFn: async (values: PurchaseItemUpdateFormType) => {
      const dataToUpdate = {
        item_name: sanitize(values.item_name),
        price: values.price,
        item_gender: item.item_gender,
      };

      const { data, error } = await supabase
        .from(ITEMS_TABLE_NAME)
        .update(dataToUpdate)
        .eq("id", item.id)
        .eq("user_id", item.user_id)
        .select(); // 수정 후 데이터 반환

      if (error) {
        throw new Error(error.message);
      }

      return data?.[0]; // 아이템 데이터 onSuccess로 반환
    },
    onSuccess: () => {
      toast.success("아이템이 수정되었습니다!");
      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["items"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-items", user?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["filtered-items", user?.id],
      });
    },
    onError: (err) => {
      toast.error("아이템 수정에 실패했습니다.");
      console.error(err);
    },
  });

  const onSubmit = (values: PurchaseItemUpdateFormType) => {
    updateItemMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="icon"
        className="gap-1.5 text-xs"
        aria-label="아이템 수정"
        title="아이템 수정"
        onClick={() => setOpen(true)}
      >
        <Pencil />
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>아이템 수정</DialogTitle>
          <DialogDescription>
            아이템 정보를 변경할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="grid gap-8 px-2">
              <div className="grid gap-3">
                <label htmlFor="item_name" className="text-sm">
                  아이템명
                </label>
                <Controller
                  name="item_name"
                  control={control}
                  render={({ field }) => (
                    <SearchInput
                      value={field.value}
                      placeholder="아이템명"
                      className="w-full"
                      onSearch={field.onChange}
                      onSelectSuggestion={(s) => {
                        form.setValue("item_name", s.name);
                        form.setValue(
                          "item_gender",
                          s.item_gender as ItemGender
                        );
                      }}
                    />
                  )}
                />
              </div>

              <div className="grid gap-3">
                <label htmlFor="price" className="text-sm">
                  가격
                </label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      id="price"
                      inputMode="numeric"
                      placeholder="가격"
                      value={value === 0 ? "0" : value.toLocaleString()} // 천단위 표시
                      onFocus={(e) => {
                        if (value === 0) e.target.value = ""; // 포커스 시 초기값 제거
                      }}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, ""); // 콤마 제거
                        if (/^\d*$/.test(raw)) {
                          // 음수 방지
                          const num = raw === "" ? 0 : Number(raw);
                          onChange(num);
                        }
                      }}
                      onBlur={onBlur}
                      autoComplete="off"
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">닫기</Button>
              </DialogClose>
              <Button type="submit" disabled={updateItemMutation.isPending}>
                {updateItemMutation.isPending ? "수정 중..." : "수정하기"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
