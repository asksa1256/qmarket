"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
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
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { supabase } from "@/shared/api/supabase-client";
import { sanitize } from "@/shared/lib/sanitize";
import { ItemFormSchema, ItemFormValues } from "../model/schema";
import { ITEM_GENDER_MAP, ITEM_SOURCES_MAP } from "@/shared/config/constants";
import { Item } from "@/entities/item/model/types";

type ItemEditModalType = Omit<Item, "nickname" | "image">;

interface ItemEditModalProps {
  item: ItemEditModalType;
}

export default function ItemEditModal({ item }: ItemEditModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      item_name: item.item_name,
      price: item.price,
      is_sold: item.is_sold ? "sold" : "selling",
      // is_online: item.is_online ? "online" : "offline",
      item_source: Object.keys(ITEM_SOURCES_MAP).find(
        (key) =>
          ITEM_SOURCES_MAP[key as keyof typeof ITEM_SOURCES_MAP] ===
          item.item_source
      ) as "gatcha" | "shop" | "lottery" | "magic",
      item_gender: Object.keys(ITEM_GENDER_MAP).find(
        (key) =>
          ITEM_GENDER_MAP[key as keyof typeof ITEM_GENDER_MAP] ===
          item.item_gender
      ) as "m" | "w",
    },
  });

  const { register, handleSubmit, control } = form;

  const updateItemMutation = useMutation({
    mutationFn: async (values: ItemFormValues) => {
      const dataToUpdate = {
        item_name: sanitize(values.item_name),
        price: values.price,
        is_sold: values.is_sold === "sold",
        // is_online: values.is_online === "online",
        item_source: ITEM_SOURCES_MAP[values.item_source],
        item_gender: ITEM_GENDER_MAP[values.item_gender],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("items")
        .update(dataToUpdate)
        .eq("id", item.id)
        .eq("user_id", item.user_id)
        .select(); // 수정 후 데이터 반환

      if (error) {
        throw new Error(error.message);
      }

      return data?.[0]; // 아이템 데이터 onSuccess로 반환
    },
    onSuccess: (updatedItem) => {
      toast.success("아이템이 수정되었습니다!");
      setOpen(false);

      // 캐시 업데이트 (UI 즉시 반영)
      queryClient.setQueryData<InfiniteData<Item[]> | undefined>(
        ["my-items", item.user_id],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.map((i) => (i.id === updatedItem.id ? updatedItem : i))
            ),
          };
        }
      );
    },
    onError: (err) => {
      toast.error("아이템 수정에 실패했습니다.");
      console.error(err);
    },
  });

  const onSubmit = (values: ItemFormValues) => {
    updateItemMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        aria-label="아이템 수정"
        className="absolute right-4 top-4"
        onClick={() => setOpen(true)}
      >
        <Pencil /> 수정하기
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
                <Input id="item_name" {...register("item_name")} />
              </div>

              <div className="grid gap-3">
                <label htmlFor="price" className="text-sm">
                  가격
                </label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>

              {/* 아이템 성별 */}
              <div className="grid gap-3">
                <label htmlFor="item_gender1" className="text-sm">
                  아이템 성별
                </label>
                <Controller
                  name="item_gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="m" id="item_gender1" />
                        <Label htmlFor="item_gender1">
                          {ITEM_GENDER_MAP.m}
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="w" id="item_gender2" />
                        <Label htmlFor="item_gender2">
                          {ITEM_GENDER_MAP.w}
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* 판매 상태 */}
              <div className="grid gap-3">
                <label htmlFor="selling" className="text-sm">
                  판매 상태
                </label>
                <Controller
                  name="is_sold"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="selling" id="selling" />
                        <Label htmlFor="selling">판매중</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="sold" id="sold" />
                        <Label htmlFor="sold">판매완료</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* 온라인/미접속 */}
              {/* <div className="grid gap-3">
                <label htmlFor="online" className="text-sm">
                  접속 상태
                </label>
                <Controller
                  name="is_online"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online">온라인</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="offline" id="offline" />
                        <Label htmlFor="offline">미접속</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div> */}

              {/* 아이템 출처 */}
              <div className="grid gap-3">
                <label htmlFor="source1" className="text-sm">
                  아이템 출처
                </label>
                <Controller
                  name="item_source"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="gatcha" id="source1" />
                        <Label htmlFor="source1">뽑기</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="shop" id="source2" />
                        <Label htmlFor="source2">상점</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="magic" id="source3" />
                        <Label htmlFor="source3">요술상자</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="lottery" id="source4" />
                        <Label htmlFor="source4">복권</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">닫기</Button>
              </DialogClose>
              <Button type="submit" disabled={updateItemMutation.isPending}>
                {updateItemMutation.isPending ? "수정 중..." : "저장하기"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
