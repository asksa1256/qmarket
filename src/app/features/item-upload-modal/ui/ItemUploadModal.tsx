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
import { supabase } from "@/shared/api/supabase-client";
import { sanitize } from "@/shared/lib/sanitize";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { ItemFormValues, ItemFormSchema } from "../model/schema";
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
import { cn } from "@/shared/lib/utils";

export default function ItemUploadModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const createItemMutation = useMutation({
    mutationFn: async (values: ItemFormValues) => {
      const dataToInsert = {
        item_name: sanitize(values.item_name),
        price: values.price,
        is_sold: false,
        // is_online: values.is_online === "online",
        item_source: ITEM_SOURCES_MAP[values.item_source],
        nickname: user?.user_metadata.custom_claims.global_name, // 디스코드 닉네임
        discord_id: user?.user_metadata.full_name, // 디스코드 아이디
        item_gender: ITEM_GENDER_MAP[values.item_gender],
        user_id: user?.id,
        category: ITEM_CATEGORY_MAP[values.category],
      };

      const { data, error } = await supabase
        .from("items")
        .insert([dataToInsert])
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      toast.success("상품이 등록되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (err) => {
      toast.error("상품 등록에 실패했습니다.");
      console.error(err);
    },
  });

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      item_name: "",
      price: 0,
      is_sold: "selling",
      item_source: "gatcha",
      item_gender: "m",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (values: ItemFormValues) => {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="default"
        className="w-auto font-bold bg-blue-600 hover:bg-blue-700"
        onClick={handleItemUploadOpen}
      >
        {user ? <Plus /> : <Lock />} 아이템 등록
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>아이템 등록하기</DialogTitle>
          <DialogDescription className="flex flex-col">
            <span>판매중인 아이템 정보를 등록해주세요.</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="grid gap-8 px-2">
              <div className="grid gap-3">
                <label htmlFor="item_name" className="text-sm">
                  아이템명
                </label>
                <Input
                  id="item_name"
                  placeholder="아이템명"
                  {...register("item_name")}
                />
                {errors.item_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.item_name.message}
                  </p>
                )}
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
