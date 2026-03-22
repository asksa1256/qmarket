"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { ItemFormType } from "../../model/schema";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

const PRICE_UNITS = [
  { label: "+ 천원", amount: 1000 },
  { label: "+ 오천원", amount: 5000 },
  { label: "+ 만원", amount: 10000 },
  { label: "+ 오만원", amount: 50000 },
  { label: "+ 십만원", amount: 100000 },
  { label: "+ 오십만원", amount: 500000 },
  { label: "+ 백만원", amount: 1000000 },
  { label: "+ 오백만원", amount: 5000000 },
  { label: "+ 천만원", amount: 10000000 },
] as const;

interface PriceFieldProps {
  form: UseFormReturn<ItemFormType>;
}

export default function PriceField({ form }: PriceFieldProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-3">
      <label htmlFor="price" className="text-sm">
        가격
      </label>
      <Controller
        name="price"
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
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
              {PRICE_UNITS.map((unit) => (
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
        )}
      />
      {errors.price && (
        <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
      )}
    </div>
  );
}
