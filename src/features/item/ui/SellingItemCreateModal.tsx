"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sanitize } from "@/shared/lib/sanitize";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { ItemFormType, ItemFormSchema } from "../model/schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ITEM_SOURCES_MAP,
  ITEM_GENDER_MAP,
  ITEM_CATEGORY_MAP,
} from "@/shared/config/constants";
import { Lock, Plus } from "lucide-react";
import { useUser } from "@/shared/hooks/useUser";
import { useState } from "react";
import { createSellingItem } from "../model/actions";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { Textarea } from "@/shared/ui/textarea";

export default function SellingItemCreateModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const createItemMutation = useMutation({
    mutationFn: async (values: ItemFormType) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      console.log(values);

      return createSellingItem({
        item_name: values.item_name,
        price: values.price,
        image: values.image,
        is_sold: false,
        is_for_sale: true,
        item_source: ITEM_SOURCES_MAP[values.item_source],
        nickname: user?.user_metadata.custom_claims.global_name, // 디스코드 닉네임
        discord_id: user?.user_metadata.full_name,
        item_gender: ITEM_GENDER_MAP[values.item_gender],
        user_id: user?.id,
        category: ITEM_CATEGORY_MAP[values.category],
        message: values.message || "",
      });
    },
    onSuccess: async () => {
      toast.success(`판매 아이템을 등록했습니다.`);
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["my-items", user?.id] });
      queryClient.invalidateQueries({
        queryKey: ["filtered-items"],
      });
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });

  const form = useForm<ItemFormType>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      item_name: "",
      image: "/images/empty.png",
      price: 0,
      item_source: "gatcha",
      item_gender: "m",
      is_sold: false,
      category: "clothes",
      message: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (values: ItemFormType) => {
    createItemMutation.mutate(values, {
      onSuccess: () => {
        reset(); // 폼 초기화
      },
    });
  };

  const handleItemUploadOpen = () => {
    if (user) {
      setOpen(true);
    } else {
      setOpen(false);
      toast.error("로그인이 필요합니다.");
    }
  };

  // 자동완성 아이템 선택 시 미리보기 이미지
  const watchedImage = form.watch("image");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="default"
        className="w-auto font-bold bg-blue-600 hover:bg-blue-700"
        disabled={!user}
        onClick={handleItemUploadOpen}
      >
        {user ? <Plus /> : <Lock />} 판매 아이템 등록
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>아이템 등록</DialogTitle>
          <DialogDescription className="flex flex-col">
            <span>판매할 아이템을 등록해주세요.</span>
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

                        form.setValue("item_gender", genderKey);

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

              {Object.keys(errors).length > 0 && (
                <div className="text-red-600 text-sm">
                  {JSON.stringify(errors)}
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">닫기</Button>
              </DialogClose>
              <Button type="submit" disabled={createItemMutation.isPending}>
                {createItemMutation.isPending ? "등록 중..." : "등록하기"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
