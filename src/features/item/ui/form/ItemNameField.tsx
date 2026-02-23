"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { ItemFormType } from "../../model/schema";
import SearchInput from "@/features/item-search/ui/SearchInput";
import {
  ITEM_CATEGORY_MAP,
  ITEM_GENDER_MAP,
  ITEM_SOURCES_MAP,
} from "@/shared/config/constants";

interface ItemNameFieldProps {
  form: UseFormReturn<ItemFormType>;
}

export default function ItemNameField({ form }: ItemNameFieldProps) {
  const {
    control,
    formState: { errors },
  } = form;

  const watchedImage = form.watch("image");

  return (
    <div className="grid gap-3">
      <label htmlFor="item_name" className="text-sm">
        아이템명
      </label>

      <div className="mb-4">
        <img
          src={watchedImage ?? "/images/empty.png"}
          alt="미리보기"
          className="w-24 h-24 object-contain rounded-md border"
        />
      </div>

      <Controller
        name="item_name"
        control={control}
        render={({ field }) => (
          <SearchInput
            value={field.value}
            placeholder="아이템명 입력"
            isSearchMode={false}
            className="w-full [&_svg]:size-5 [&_svg]:right-4"
            onSearch={(value) => {
              field.onChange(value);
            }}
            onSelectSuggestion={(s) => {
              field.onChange(s.name);

              const categoryKey = Object.entries(ITEM_CATEGORY_MAP).find(
                ([, label]) => label === s.category
              )?.[0] as keyof typeof ITEM_CATEGORY_MAP;

              form.setValue("category", categoryKey);

              const genderKey = Object.entries(ITEM_GENDER_MAP).find(
                ([, label]) => label === s.item_gender
              )?.[0] as keyof typeof ITEM_GENDER_MAP;

              form.setValue("item_gender", genderKey);

              const sourceKey = Object.entries(ITEM_SOURCES_MAP).find(
                ([, label]) => label === s.item_source
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
  );
}
