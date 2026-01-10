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
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminDirectPriceForm() {
  const router = useRouter();

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
      // 날짜 형식 변환: 'yyyy-mm-dd hh:mm:00+00'
      const formattedDate = `${values.created_at}:00+00`;

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
        created_at: formattedDate,
      };

      await createAdminPrice(itemData);

      reset();
      alert("아이템이 성공적으로 등록되었습니다.");
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "등록 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  const watchedImage = form.watch("image");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4 item-form">
      <div className="grid gap-8 px-2">
        <div className="grid gap-3">
          <label htmlFor="item_name" className="text-sm">
            아이템명
          </label>

          <div className="mb-4">
            <Image
              src={watchedImage || "/images/empty.png"}
              alt="미리보기"
              width={48}
              height={58}
              className="object-contain rounded-md"
            />
          </div>

          <Controller
            name="item_name"
            control={control}
            render={({ field }) => (
              <SearchInput
                value={field.value}
                placeholder="아이템명 입력"
                className="w-full [&_svg]:size-5 [&_svg]:right-4"
                onSearch={(value) => {
                  field.onChange(value);
                }}
                onSelectSuggestion={(s) => {
                  field.onChange(s.name);

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

                  if (sourceKey) {
                    form.setValue("item_source", sourceKey);
                  } else {
                    form.setValue("item_source", "gatcha");
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
            <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* 시세 등록일자 */}
        <div className="space-y-2">
          <label htmlFor="created_at" className="text-sm font-medium block">
            등록일자
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
                  className="w-full"
                />
                <div className="flex gap-2">
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
                    className="text-xs"
                  >
                    현재 시각
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChange("")}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    초기화
                  </Button>
                </div>
                {value && (
                  <p className="text-sm text-gray-600">
                    선택된 일시:{" "}
                    <span className="font-semibold">
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

      <div className="mt-6 flex justify-end gap-2">
        <Button disabled={isSubmitting}>
          {isSubmitting ? "등록 중..." : "등록하기"}
        </Button>
      </div>
    </form>
  );
}
