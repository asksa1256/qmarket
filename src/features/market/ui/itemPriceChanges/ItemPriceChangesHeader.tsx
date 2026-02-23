import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addWeeks } from "date-fns";
import { cn } from "@/shared/lib/utils";
import {
  getWeekStart,
  getWeekRange,
  formatDateYMD,
} from "@/shared/lib/formatters";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";

interface ItemPriceChangesHeaderProps {
  preview?: boolean;
  filter: "all" | "up" | "down";
  onFilterChange: (filter: "all" | "up" | "down") => void;
  onWeekChange?: (weekStart: Date) => void;
}

export default function ItemPriceChangesHeader({
  preview = false,
  filter,
  onFilterChange,
  onWeekChange,
}: ItemPriceChangesHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  /** 기준 주 시작일 (월요일) 설정 */
  const weekStart = useMemo(() => {
    const parsed = weekParam ? new Date(weekParam) : null;
    if (!parsed || isNaN(parsed.getTime())) {
      return getWeekStart(new Date());
    }
    return getWeekStart(parsed);
  }, [weekParam]);

  const { start, end } = getWeekRange(weekStart);

  // 이번주 기준 설정 (다음주 방지)
  const currentWeekStart = getWeekStart(new Date());
  const isNextDisabled = weekStart >= currentWeekStart;

  const moveWeek = (offset: number) => {
    const newDate = addWeeks(weekStart, offset);
    router.replace(`?week=${formatDateYMD(newDate)}`);
    onWeekChange?.(newDate);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full items-center justify-between mb-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => moveWeek(-1)}
          className={cn("text-sm text-gray-500 hover:text-gray-900", {
            hidden: preview,
          })}
        >
          <ChevronLeft /> 지난주
        </Button>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg bg-gray-50 border hover:bg-gray-100 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-500",
                {
                  "items-start": preview,
                }
              )}
            >
              <span className="text-sm text-foreground text-medium pointer-events-none">
                {format(start, "yyyy.MM.dd")} ~ {format(end, "MM.dd")}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={weekStart}
              onSelect={(date) => {
                if (date) {
                  const newWeekStart = getWeekStart(date);
                  router.replace(`?week=${formatDateYMD(newWeekStart)}`);
                  onWeekChange?.(newWeekStart);
                  setIsCalendarOpen(false);
                }
              }}
              disabled={(date) => date > new Date()}
              modifiers={{
                selectedWeek: (date) => date >= start && date <= end,
              }}
              modifiersClassNames={{
                selectedWeek: "bg-accent/50 text-accent-foreground",
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          disabled={isNextDisabled}
          className={cn("flex items-center gap-1", {
            "text-gray-300 border-gray-200 cursor-not-allowed": isNextDisabled,
            "text-gray-600 hover:bg-gray-50": !isNextDisabled,
            hidden: preview,
          })}
          onClick={() => moveWeek(1)}
        >
          다음주 <ChevronRight />
        </Button>
      </div>

      {!preview && (
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => onFilterChange("all")}
            className={cn("px-3 py-1 text-xs rounded-full", {
              "bg-gray-900 text-white": filter === "all",
              "bg-gray-100 text-gray-600": filter !== "all",
            })}
          >
            변동률 전체
          </button>

          <button
            onClick={() => onFilterChange("up")}
            className={cn("px-3 py-1 text-xs rounded-full", {
              "bg-red-500 text-white": filter === "up",
              "bg-red-50 text-red-500": filter !== "up",
            })}
          >
            상승
          </button>

          <button
            onClick={() => onFilterChange("down")}
            className={cn("px-3 py-1 text-xs rounded-full", {
              "bg-blue-500 text-white": filter === "down",
              "bg-blue-50 text-blue-500": filter !== "down",
            })}
          >
            하락
          </button>
        </div>
      )}
    </div>
  );
}
