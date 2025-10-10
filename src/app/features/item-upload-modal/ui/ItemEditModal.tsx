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
} from "@/entities/item/model/types";
import { cn } from "@/shared/lib/utils";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";

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
      ) as ItemSource,
      item_gender: Object.keys(ITEM_GENDER_MAP).find(
        (key) =>
          ITEM_GENDER_MAP[key as keyof typeof ITEM_GENDER_MAP] ===
          item.item_gender
      ) as ItemGender,
      category: Object.keys(ITEM_CATEGORY_MAP).find(
        (key) =>
          ITEM_CATEGORY_MAP[key as keyof typeof ITEM_CATEGORY_MAP] ===
          item.category
      ) as ItemCategory,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const updateItemMutation = useMutation({
    mutationFn: async (values: ItemFormValues) => {
      const dataToUpdate = {
        item_name: sanitize(values.item_name),
        price: values.price,
        is_sold: values.is_sold === "sold",
        // is_online: values.is_online === "online",
        item_source: ITEM_SOURCES_MAP[values.item_source],
        item_gender: ITEM_GENDER_MAP[values.item_gender],
        category: ITEM_CATEGORY_MAP[values.category],
        updated_at: new Date().toISOString(),
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
        size="icon"
        title="수정하기"
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
                        field.onChange(s.name); // 아이템명 업데이트

                        const categoryKey = Object.entries(
                          ITEM_CATEGORY_MAP
                        ).find(
                          ([key, label]) => label === s.category
                        )?.[0] as keyof typeof ITEM_CATEGORY_MAP;

                        if (categoryKey) {
                          form.setValue("category", categoryKey); // 카테고리 자동 선택
                        }
                      }}
                    />
                  )}
                />
              </div>

              {/* 아이템 카테고리 */}
              <div className="grid gap-3">
                <label htmlFor="category" className="text-sm">
                  카테고리
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {Object.entries(ITEM_CATEGORY_MAP).map(
                        ([key, label], idx) => (
                          <div key={key} className="relative">
                            <RadioGroupItem
                              value={key}
                              id={`category${idx + 1}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`category${idx + 1}`}
                              className={cn(
                                "cursor-pointer rounded-full border px-4 py-2 text-sm transition",
                                "text-gray-700 hover:bg-blue-50",
                                "peer-data-[state=checked]:bg-blue-600 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:hover:bg-blue-600"
                              )}
                            >
                              {label}
                            </Label>
                          </div>
                        )
                      )}
                    </RadioGroup>
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
                      {Object.entries(ITEM_GENDER_MAP).map(
                        ([key, label], idx) => (
                          <div
                            className="flex items-center gap-3"
                            key={`${key}-${idx}`}
                          >
                            <RadioGroupItem value={key} id={key} />
                            <Label htmlFor={key}>{label}</Label>
                          </div>
                        )
                      )}
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
                      {Object.entries(ITEM_SOURCES_MAP).map(
                        ([key, label], idx) => (
                          <div
                            className="flex items-center gap-3"
                            key={`${key}=${idx}`}
                          >
                            <RadioGroupItem value={key} id={key} />
                            <Label htmlFor={key}>{label}</Label>
                          </div>
                        )
                      )}
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
