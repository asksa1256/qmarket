"use client";

import { useState } from "react";
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
import { ItemFormSchema, ItemFormType } from "../model/schema";
import { Item } from "@/features/item/model/itemTypes";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";
import { useUser } from "@/shared/hooks/useUser";
import { Textarea } from "@/shared/ui/textarea";
import {
  ITEM_CATEGORY_MAP,
  ITEM_GENDER_MAP,
  ITEM_SOURCES_MAP,
} from "@/shared/config/constants";

interface ItemUpdateModalProps {
  item: Item;
}

// rhf defaultValues에 일부 컬럼 역매핑 (key 리턴)
const getKeyByValue = <T extends Record<string, string>>(
  map: T,
  value: string
): keyof T => {
  const entry = Object.entries(map).find(([_, v]) => v === value);
  return (entry?.[0] || Object.keys(map)[0]) as keyof T;
};

export default function ItemUpdateModal({ item }: ItemUpdateModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const form = useForm<ItemFormType>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      item_name: item.item_name,
      price: item.price,
      image: item.image,
      item_source: getKeyByValue(ITEM_SOURCES_MAP, item.item_source),
      item_gender: getKeyByValue(ITEM_GENDER_MAP, item.item_gender),
      is_sold: item.is_sold,
      category: getKeyByValue(ITEM_CATEGORY_MAP, item.category),
      message: item.message,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const updateItemMutation = useMutation({
    mutationFn: async (values: ItemFormType) => {
      const updatedValues = {
        ...values,
        item_source: ITEM_SOURCES_MAP[values.item_source],
        item_gender: ITEM_GENDER_MAP[values.item_gender],
        category: ITEM_CATEGORY_MAP[values.category],
      };

      const { data, error } = await supabase
        // .from(ITEMS_TABLE_NAME)
        .from("items_test")
        .update(updatedValues)
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

  const onSubmit = (values: ItemFormType) => {
    updateItemMutation.mutate(values);
  };

  // 자동완성 아이템 선택 시 미리보기 이미지
  const watchedImage = form.watch("image");

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

                {watchedImage && (
                  <div className="mb-4">
                    <img
                      src={watchedImage}
                      alt="미리보기"
                      className="w-24 h-24 object-contain rounded-md border"
                    />
                  </div>
                )}

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
                        field.onChange(s.name); // 아이템명 업데이트

                        const categoryKey = Object.entries(
                          ITEM_CATEGORY_MAP
                        ).find(
                          ([_key, label]) => label === s.category
                        )?.[0] as keyof typeof ITEM_CATEGORY_MAP;

                        if (categoryKey) {
                          form.setValue("category", categoryKey); // 카테고리 자동 선택
                        }

                        const genderKey = Object.entries(ITEM_GENDER_MAP).find(
                          ([_key, label]) => label === s.item_gender
                        )?.[0] as keyof typeof ITEM_GENDER_MAP;

                        if (genderKey) {
                          form.setValue("item_gender", genderKey);
                        }

                        form.setValue("image", s.image);
                      }}
                    />
                  )}
                />
                {errors.item_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.item_name.message}
                  </p>
                )}
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

              <div className="grid gap-3">
                <label htmlFor="price" className="text-sm">
                  메시지
                </label>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="message"
                      placeholder="메시지를 입력해주세요. (e.g. DM 주세요!)"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
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

            {Object.keys(errors).length > 0 && (
              <div className="text-red-600 text-sm">
                {JSON.stringify(errors)}
              </div>
            )}

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
