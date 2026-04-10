"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Accordion } from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import NewItemList from "./NewItemList";
import { ItemCardSmallProps } from "@/features/item/ui/ItemCardSmall";
import { FetchError } from "@/shared/config/types";

interface AllRotationClientProps {
  months: string[];
  selectedMonth: string;
  maleGatchaItems: { data: ItemCardSmallProps[]; error: FetchError | null };
  femaleGatchaItems: { data: ItemCardSmallProps[]; error: FetchError | null };
  maleMagicItems: { data: ItemCardSmallProps[]; error: FetchError | null };
  femaleMagicItems: { data: ItemCardSmallProps[]; error: FetchError | null };
}

export default function AllRotationClient({
  months,
  selectedMonth,
  maleGatchaItems,
  femaleGatchaItems,
  maleMagicItems,
  femaleMagicItems,
}: AllRotationClientProps) {
  const router = useRouter();
  const [gender, setGender] = useState<"남" | "여">("남");

  const formatMonthLabel = (month: string) => {
    const [year, m] = month.split("-");
    return `${year}년 ${parseInt(m)}월`;
  };

  const handleMonthChange = (value: string) => {
    router.push(`/rotation-items/all?month=${value}`);
  };

  return (
    <div className="space-y-6">
      {/* 월 선택기 */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">월 선택</span>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {formatMonthLabel(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 성별 토글 */}
      <div className="flex gap-2">
        <Button
          variant={gender === "남" ? "default" : "outline"}
          size="sm"
          onClick={() => setGender("남")}
        >
          남
        </Button>
        <Button
          variant={gender === "여" ? "default" : "outline"}
          size="sm"
          onClick={() => setGender("여")}
        >
          여
        </Button>
      </div>

      {/* 아이템 목록 */}
      <Accordion type="multiple" defaultValue={["gatcha", "magic"]} className="space-y-4">
        {gender === "남" ? (
          <>
            <NewItemList
              title="뽑기"
              items={maleGatchaItems.data}
              error={maleGatchaItems.error}
              value="gatcha"
            />
            <NewItemList
              title="요술상자"
              items={maleMagicItems.data}
              error={maleMagicItems.error}
              value="magic"
            />
          </>
        ) : (
          <>
            <NewItemList
              title="뽑기"
              items={femaleGatchaItems.data}
              error={femaleGatchaItems.error}
              value="gatcha"
            />
            <NewItemList
              title="요술상자"
              items={femaleMagicItems.data}
              error={femaleMagicItems.error}
              value="magic"
            />
          </>
        )}
      </Accordion>
    </div>
  );
}
