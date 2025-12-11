"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export default function RollingPopularSearch({ data }: { data: any[] }) {
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
      <div className="flex items-center gap-3 w-full max-w-[300px]">
        <h5 className="shrink-0 text-sm font-semibold text-slate-700">
          인기 검색어
        </h5>

        {/* 롤링/드롭다운 컨테이너 */}
        <div className="relative flex-1 h-[32px] overflow-hidden">
          {!isOpen ? (
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${currentIndex * 32}px)` }}
            >
              {data.map((item, idx) => {
                const itemName = item.keyword.split("(")[0];
                const itemGender = item.keyword.split("(")[1]?.slice(0, 1);
                return (
                  <div
                    key={item.keyword}
                    className="h-[32px] flex items-center"
                  >
                    <Link
                      href={`/item/${itemName}/${itemGender}`}
                      className="flex items-center gap-2 group"
                    >
                      <span className="text-xs font-bold text-blue-600 w-4">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-600 group-hover:text-blue-600 truncate">
                        {itemName}{" "}
                        <span className="text-[10px] opacity-50">
                          ({itemGender})
                        </span>
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            // 드롭다운 활성화 시 placeholder text
            <div className="h-[32px] flex items-center text-xs text-slate-400">
              최대 10개 표시
            </div>
          )}
        </div>

        {/* 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors"
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 드롭다운 펼침 목록 */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full min-w-[200px] mt-1 p-2 bg-white border rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <ul className="flex flex-col gap-1">
            {data.map((item, idx) => {
              const itemName = item.keyword.split("(")[0];
              const itemGender = item.keyword.split("(")[1]?.slice(0, 1);
              return (
                <li key={item.keyword}>
                  <Link
                    href={`/item/${itemName}/${itemGender}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <span
                      className={cn(
                        "text-xs font-bold w-4",
                        idx < 3 ? "text-blue-600" : "text-slate-400"
                      )}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <span className="text-sm text-slate-700">{itemName}</span>
                      <span className="text-xs text-slate-400">
                        ({itemGender})
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
