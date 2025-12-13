"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface PopularSearch {
  keyword: string;
  score: number;
}

export default function RollingPopularSearch({
  data,
}: {
  data: PopularSearch[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 3초마다 인덱스 순환 (드롭다운이 닫혀있을 때만 작동)
  useEffect(() => {
    if (isOpen || !data || data.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isOpen, data]);

  if (!data || data.length === 0) return null;

  return (
    <div className="relative flex flex-col items-start gap-2 mt-1">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-3 w-full md:w-[300px]">
          <h5 className="shrink-0 text-sm font-semibold text-slate-700">
            인기 검색어
          </h5>

          <DropdownMenuTrigger asChild>
            <button className="flex-1 flex items-center gap-2 outline-none group cursor-pointer">
              <div className="relative flex-1 h-[32px] overflow-hidden text-left">
                {!isOpen ? (
                  <div
                    className="transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateY(-${currentIndex * 32}px)` }}
                  >
                    {data.map((item, idx) => {
                      let itemName;
                      const open = item.keyword.lastIndexOf("(");
                      const close = item.keyword.lastIndexOf(")");
                      if (open !== -1 && close > open) {
                        itemName = item.keyword.slice(0, open); // 마지막 '(' 기준으로 앞부분만
                      }
                      const itemGender = item.keyword.slice(open + 1, close);

                      return (
                        <div
                          key={item.keyword}
                          className="h-[32px] flex items-center"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-600 w-4 text-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-slate-600 truncate">
                              {itemName}{" "}
                              <span className="text-[10px] opacity-50">
                                ({itemGender})
                              </span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // 드롭다운 열렸을 때 상단 placeholder 텍스트
                  <div className="h-[32px] flex items-center text-xs text-slate-400 pl-1">
                    최대 10개
                  </div>
                )}
              </div>

              <div className="p-1 rounded-full group-hover:bg-slate-100 transition-colors text-slate-500">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
        </div>

        {/* 드롭다운 컨텐츠 */}
        <DropdownMenuContent
          className="md:w-[220px] max-h-[400px] overflow-y-auto rounded-xl p-2"
          align="start"
          sideOffset={5}
        >
          {data.map((item, idx) => {
            let itemName;
            const open = item.keyword.lastIndexOf("(");
            const close = item.keyword.lastIndexOf(")");
            if (open !== -1 && close > open) {
              itemName = item.keyword.slice(0, open); // 마지막 '(' 기준으로 앞부분만
            }
            const itemGender = item.keyword.slice(open + 1, close);

            return (
              <DropdownMenuItem key={item.keyword} asChild>
                <Link
                  href={`/item/${itemName}/${itemGender}`}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer focus:bg-blue-50 focus:text-slate-900"
                >
                  <span
                    className={cn(
                      "text-xs font-bold w-4 text-center",
                      idx < 3 ? "text-blue-600" : "text-slate-400"
                    )}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-sm font-medium text-slate-700">
                      {itemName}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({itemGender})
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
