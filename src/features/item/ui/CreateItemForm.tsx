"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemFormType, ItemFormSchema } from "../model/schema";
import { ScrollArea } from "@/shared/ui/scroll-area";
import SearchInput from "@/features/item-search/ui/SearchInput";
import {
  ITEM_CATEGORY_MAP,
  ITEM_GENDER_MAP,
  ITEM_SOURCES_MAP,
} from "@/shared/config/constants";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { useCreateItemMutation } from "../model/createItemMutation";
import { useState } from "react";

interface CreateItemFormProps {
  isForSale: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CreateItemForm({
  isForSale,
  onSuccess,
  onClose,
}: CreateItemFormProps) {
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

  // 자동완성에서 선택했는지 추적
  const [isFromSuggestion, setIsFromSuggestion] = useState(false);

  const createItemMutation = useCreateItemMutation({
    onSuccessCallback: onSuccess,
    isForSale: isForSale,
  });

  const onSubmit = (values: ItemFormType) => {
    const payload = {
      ...values,
      image: isFromSuggestion ? values.image : "/images/empty.png",
    };

    createItemMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        setIsFromSuggestion(false);
      },
    });
  };

  const watchedImage = form.watch("image");
  const watchedItemName = form.watch("item_name");

  return (
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
                  src={!isFromSuggestion ? "/images/empty.png" : watchedImage}
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
                  onSearch={(value) => {
                    field.onChange(value);
                    setIsFromSuggestion(false); // 직접 입력 시 자동완성 여부 false 처리
                    form.setValue("image", "/images/empty.png");
                  }}
                  onSelectSuggestion={(s) => {
                    field.onChange(s.name);
                    setIsFromSuggestion(true);

                    const categoryKey = Object.entries(ITEM_CATEGORY_MAP).find(
                      ([_key, label]) => label === s.category
                    )?.[0] as keyof typeof ITEM_CATEGORY_MAP;

                    form.setValue("category", categoryKey);

                    const genderKey = Object.entries(ITEM_GENDER_MAP).find(
                      ([_key, label]) => label === s.item_gender
                    )?.[0] as keyof typeof ITEM_GENDER_MAP;

                    form.setValue("item_gender", genderKey);

                    const sourceKey = Object.entries(ITEM_SOURCES_MAP).find(
                      ([_key, label]) => label === s.item_source
                    )?.[0] as keyof typeof ITEM_SOURCES_MAP;

                    form.setValue("item_source", sourceKey);

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

          {/* 성별 선택 - 아이템 직접 입력 시에만 표시 */}
          {!isFromSuggestion && watchedItemName && (
            <div className="grid gap-3">
              <label htmlFor="item_gender" className="text-sm">
                성별
              </label>
              <Controller
                name="item_gender"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={field.value === "m" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => field.onChange("m")}
                    >
                      남성
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "w" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => field.onChange("w")}
                    >
                      여성
                    </Button>
                  </div>
                )}
              />
              {errors.item_gender && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.item_gender.message}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-3">
            <label htmlFor="price" className="text-sm">
              가격
            </label>
            <Controller
              name="price"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => {
                const priceUnits = [
                  { label: "+ 십원", amount: 10 },
                  { label: "+ 백원", amount: 100 },
                  { label: "+ 천원", amount: 1000 },
                  { label: "+ 만원", amount: 10000 },
                  { label: "+ 십만원", amount: 100000 },
                  { label: "+ 백만원", amount: 1000000 },
                  { label: "+ 천만원", amount: 10000000 },
                ];

                return (
                  <div className="space-y-3">
                    <Input
                      id="price"
                      inputMode="numeric"
                      placeholder="가격"
                      value={value === 0 ? "0" : value.toLocaleString()}
                      onFocus={(e) => {
                        if (value === 0) e.target.value = "";
                      }}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        if (/^\d*$/.test(raw)) {
                          const num = raw === "" ? 0 : Number(raw);
                          onChange(num);
                        }
                      }}
                      onBlur={onBlur}
                      autoComplete="off"
                    />

                    <div className="flex flex-wrap gap-2">
                      {priceUnits.map((unit) => (
                        <Button
                          key={unit.amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onChange(value + unit.amount)}
                          className="text-xs px-3"
                        >
                          {unit.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="grid gap-3">
            <label htmlFor="message" className="text-sm">
              메시지
            </label>
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="message"
                  placeholder="인게임 닉네임, 디스코드 닉네임 등 연락 가능한 정보와 함께 적어주시면 원활한 거래에 도움이 됩니다."
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            {errors.message && (
              <p className="text-red-600 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button type="submit" disabled={createItemMutation.isPending}>
            {createItemMutation.isPending ? "등록 중..." : "등록하기"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
}
