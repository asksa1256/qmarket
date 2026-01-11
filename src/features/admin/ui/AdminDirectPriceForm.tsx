"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ITEM_CATEGORY_MAP,
  ITEM_GENDER_MAP,
  ITEM_SOURCES_MAP,
} from "@/shared/config/constants";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  AdminDirectPriceFormSchema,
  AdminDirectPriceValues,
} from "../model/adminDirectPriceFormSchema";
import { createAdminPrice } from "@/app/actions/admin-actions";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminDirectPriceForm() {
  const queryClient = useQueryClient();

  const form = useForm<AdminDirectPriceValues>({
    resolver: zodResolver(AdminDirectPriceFormSchema),
    defaultValues: {
      item_name: "",
      item_gender: "",
      item_source: "",
      category: "",
      image: "",
      price: 0,
      created_at: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: AdminDirectPriceValues) => {
    try {
      const date = new Date(values.created_at); // KST 입력

      const itemData = {
        item_name: values.item_name,
        item_gender:
          ITEM_GENDER_MAP[values.item_gender as keyof typeof ITEM_GENDER_MAP],
        item_source:
          ITEM_SOURCES_MAP[values.item_source as keyof typeof ITEM_SOURCES_MAP],
        category:
          ITEM_CATEGORY_MAP[values.category as keyof typeof ITEM_CATEGORY_MAP],
        image: values.image,
        price: values.price,
        is_sold: true,
        created_at: date.toISOString(), // db에 UTC로 변환해서 저장
      };

      await createAdminPrice(itemData);

      queryClient.invalidateQueries({ queryKey: ["filtered-items"] });

      // reset();
      alert("아이템이 성공적으로 등록되었습니다.");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "등록 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const watchedImage = form.watch("image");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6 md:space-y-8">
        {/* 아이템 정보 */}
        <div className="space-y-3">
          <label htmlFor="item_name" className="text-sm font-medium block">
            아이템명
          </label>

          {watchedImage && (
            <div className="mb-4">
              <Image
                src={watchedImage || "/images/empty.png"}
                alt="미리보기"
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-md border bg-gray-50"
                onError={(e) => {
                  e.currentTarget.src = "/images/empty.png";
                }}
              />
            </div>
          )}

          <Controller
            name="item_name"
            control={control}
            render={({ field }) => (
              <SearchInput
                value={field.value}
                placeholder="아이템명 입력"
                className="w-full [&_svg]:size-5 [&_svg]:right-4"
                onSearch={(value: string) => {
                  field.onChange(value);
                }}
                onSelectSuggestion={(s) => {
                  field.onChange(s.name);

                  const categoryKey = Object.entries(ITEM_CATEGORY_MAP).find(
                    ([_key, label]) => label === s.category
                  )?.[0] as keyof typeof ITEM_CATEGORY_MAP | undefined;

                  if (categoryKey) {
                    form.setValue("category", categoryKey);
                  }

                  const genderKey = Object.entries(ITEM_GENDER_MAP).find(
                    ([_key, label]) => label === s.item_gender
                  )?.[0] as keyof typeof ITEM_GENDER_MAP | undefined;

                  if (genderKey) {
                    form.setValue("item_gender", genderKey);
                  }

                  const sourceKey = Object.entries(ITEM_SOURCES_MAP).find(
                    ([_key, label]) => label === s.item_source
                  )?.[0] as keyof typeof ITEM_SOURCES_MAP | undefined;

                  form.setValue("item_source", sourceKey || "gatcha");

                  if (s.image) {
                    form.setValue("image", s.image);
                  }
                }}
              />
            )}
          />
          {errors.item_name && (
            <p className="text-red-600 text-sm">{errors.item_name.message}</p>
          )}
        </div>

        {/* 선택된 정보 표시 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">카테고리</label>
            <div className="text-sm font-medium">
              {form.watch("category")
                ? ITEM_CATEGORY_MAP[
                    form.watch("category") as keyof typeof ITEM_CATEGORY_MAP
                  ]
                : "미선택"}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">성별</label>
            <div className="text-sm font-medium">
              {form.watch("item_gender")
                ? ITEM_GENDER_MAP[
                    form.watch("item_gender") as keyof typeof ITEM_GENDER_MAP
                  ]
                : "미선택"}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">출처</label>
            <div className="text-sm font-medium">
              {form.watch("item_source")
                ? ITEM_SOURCES_MAP[
                    form.watch("item_source") as keyof typeof ITEM_SOURCES_MAP
                  ]
                : "미선택"}
            </div>
          </div>
        </div>

        {/* 가격 섹션 */}
        <div className="space-y-3">
          <label htmlFor="price" className="text-sm font-medium block">
            가격
          </label>
          <Controller
            name="price"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => {
              const priceUnits = [
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
                    type="text"
                    inputMode="numeric"
                    placeholder="가격을 입력하세요"
                    value={value === 0 ? "" : value.toLocaleString()}
                    onFocus={(e) => {
                      if (value === 0) {
                        e.target.value = "";
                      }
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
                    className="text-base md:text-sm"
                  />

                  <div className="flex flex-wrap gap-2">
                    {priceUnits.map((unit) => (
                      <Button
                        key={unit.amount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onChange(value + unit.amount)}
                        className="text-xs px-2.5 py-1.5 md:px-3 md:py-2 flex-grow sm:flex-grow-0"
                      >
                        {unit.label}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onChange(0)}
                      className="text-xs px-2.5 py-1.5 md:px-3 md:py-2 text-red-600 hover:text-red-700 flex-grow sm:flex-grow-0"
                    >
                      초기화
                    </Button>
                  </div>

                  {value > 0 && (
                    <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                      현재 가격:{" "}
                      <span className="font-semibold text-blue-700">
                        {value.toLocaleString()}원
                      </span>
                    </p>
                  )}
                </div>
              );
            }}
          />
          {errors.price && (
            <p className="text-red-600 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* 등록 일자 섹션 */}
        <div className="space-y-3">
          <label htmlFor="created_at" className="text-sm font-medium block">
            등록 일자
          </label>
          <Controller
            name="created_at"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <div className="space-y-3">
                <Input
                  id="created_at"
                  type="datetime-local"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  className="w-full text-base md:text-sm"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      const year = now.getFullYear();
                      const month = String(now.getMonth() + 1).padStart(2, "0");
                      const day = String(now.getDate()).padStart(2, "0");
                      const hours = String(now.getHours()).padStart(2, "0");
                      const minutes = String(now.getMinutes()).padStart(2, "0");
                      onChange(`${year}-${month}-${day}T${hours}:${minutes}`);
                    }}
                    className="text-xs flex-1 sm:flex-initial"
                  >
                    현재 시각
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChange("")}
                    className="text-xs text-red-600 hover:text-red-700 flex-1 sm:flex-initial"
                  >
                    초기화
                  </Button>
                </div>
                {value && (
                  <p className="text-sm text-gray-600 p-3 bg-green-50 rounded-lg">
                    선택된 일시:{" "}
                    <span className="font-semibold text-green-700">
                      {new Date(value).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                )}
              </div>
            )}
          />
          {errors.created_at && (
            <p className="text-red-600 text-sm">{errors.created_at.message}</p>
          )}
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </Button>
      </div>
    </form>
  );
}
