"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DirectPriceCreateFormSchema,
  DirectPriceCreateFormType,
} from "../model/directPriceSchema";
import { ScrollArea } from "@/shared/ui/scroll-area";
import SearchInput from "@/features/item-search/ui/SearchInput";
import {
  ITEM_CATEGORY_MAP,
  ITEM_GENDER_MAP,
  ITEM_SOURCES_MAP,
} from "@/shared/config/constants";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { FieldError } from "react-hook-form";
import { ItemDetail } from "@/features/item/ui/ItemDetailClient";
import { getKeyByValue } from "@/shared/lib/getKeyByValue";
import TransactionImageUploader from "./TransactionImageUploader";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/shared/hooks/useUser";
import { createDirectPriceAction } from "@/app/actions/direct-price-actions";
import { toast } from "sonner";

interface ItemFormProps {
  initialItem?: ItemDetail; // 아이템 상세 페이지에서 바로 등록할 아이템 정보
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function DirectPriceCreateForm({
  initialItem,
  onSuccess,
  onClose,
}: ItemFormProps) {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  if (!user?.id) {
    alert("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
    return;
  }

  const getDefaultValues = () => {
    if (initialItem) {
      return {
        item_name: initialItem.name,
        image: initialItem.image ?? "/images/empty.png",
        price: 0,
        item_source:
          getKeyByValue(ITEM_SOURCES_MAP, initialItem.item_source) ||
          ("gatcha" as const),
        item_gender:
          getKeyByValue(ITEM_GENDER_MAP, initialItem.item_gender) ||
          ("m" as const),
        category:
          getKeyByValue(ITEM_CATEGORY_MAP, initialItem.category) ||
          ("hair" as const),
        transaction_image: "",
        isForSale: false,
        message: "시세 바로 등록",
      };
    }

    return {
      item_name: "",
      image: "/images/empty.png",
      item_source: "gatcha" as const,
      item_gender: "m" as const,
      category: "hair" as const,
      price: 0,
      transaction_image: "",
      isForSale: false,
      message: "시세 바로 등록",
    };
  };

  const form = useForm<DirectPriceCreateFormType>({
    resolver: zodResolver(DirectPriceCreateFormSchema),
    defaultValues: getDefaultValues(),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // 거래 인증 이미지 미리보기
  const [preview, setPreview] = useState("");

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      // 파일 선택 시 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  const onSubmit = async (values: DirectPriceCreateFormType) => {
    try {
      const result = await createDirectPriceAction({
        item_name: values.item_name,
        image: values.image ?? "/images/empty.png",
        item_gender: ITEM_GENDER_MAP[values.item_gender],
        item_source: ITEM_SOURCES_MAP[values.item_source],
        category: ITEM_CATEGORY_MAP[values.category],
        price: values.price,
        is_sold: true,
        is_for_sale: values.isForSale,
        transaction_image: values.transaction_image,
        message: "시세 바로 등록",
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("시세가 등록되었습니다.");

      queryClient.invalidateQueries({
        queryKey: ["item-create-limit-count", user.id],
      });

      onSuccess?.();
      reset();
    } catch (error) {
      console.error("시세 등록 중 오류:", error);
      toast.error("시세 등록에 실패했습니다.");
    }
  };

  const watchedImage = form.watch("image");

  return (
    <ScrollArea className="max-h-[60vh] pr-4">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 item-form">
        <div className="grid gap-8 px-2">
          <div className="grid gap-2">
            <label htmlFor="item_name" className="text-sm">
              아이템명
            </label>

            <img
              src={watchedImage ?? "/images/empty.png"}
              alt="미리보기"
              className="w-24 h-24 object-contain rounded-md border"
            />

            <Controller
              name="item_name"
              control={control}
              render={({ field }) => (
                <SearchInput
                  value={field.value}
                  placeholder="아이템명 입력"
                  className="w-full [&_svg]:size-5 [&_svg]:right-4"
                  isSearchMode={false}
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

          <div className="grid gap-2">
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
              <p className="text-red-600 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* 거래 인증 이미지 섹션 */}
          <div className="grid gap-2">
            <div>
              <label htmlFor="price" className="text-sm">
                거래 인증 이미지 등록
              </label>
              <p className="text-xs text-foreground/50">
                이미지를 첨부한 뒤 [인증 등록]을 눌러주세요.
              </p>
            </div>

            <Controller
              name="transaction_image"
              control={control}
              render={({ field }) => (
                <>
                  <TransactionImageUploader
                    onFileChange={handleFileChange}
                    onUpload={(imgUrl) => {
                      field.onChange(imgUrl);
                    }}
                  />
                  {preview && (
                    <div className="relative w-full h-32 rounded-md overflow-hidden border border-gray-300">
                      <Image
                        src={preview}
                        alt="거래 인증 이미지 미리보기"
                        fill
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </>
              )}
            />
            {errors.transaction_image && (
              <p className="text-red-600 text-sm">
                {errors.transaction_image.message}
              </p>
            )}
          </div>

          {/* 거래 유형 선택 섹션 */}
          <div className="grid gap-2">
            <label className="text-sm">거래 유형</label>
            <Controller
              name="isForSale"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={!field.value ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => field.onChange(false)}
                  >
                    구매
                  </Button>
                  <Button
                    type="button"
                    variant={field.value ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => field.onChange(true)}
                  >
                    판매
                  </Button>
                </div>
              )}
            />
            {errors.isForSale && (
              <p className="text-red-600 text-sm">{errors.isForSale.message}</p>
            )}
          </div>
        </div>

        {/* 폼 유효성 검사 에러 로그 */}
        {/* {(
          Object.entries(errors) as [
            keyof DirectPriceCreateFormType,
            FieldError
          ][]
        ).map(([key, error]) => (
          <li key={key as string} className="text-red-600 text-sm">
            <span className="font-medium mr-1">
              {(key as string).includes("item_name") ? "아이템명" : key}:
            </span>
            {error?.message}
          </li>
        ))} */}

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button disabled={isSubmitting}>
            {isSubmitting ? "등록 중..." : "등록하기"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
}
