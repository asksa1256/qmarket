import { DAILY_LIMIT } from "@/shared/api/redis";
import { useQuery } from "@tanstack/react-query";
import { getRemainingTimeAction } from "@/app/actions/item-actions";
import { useState, useEffect } from "react";
import { formatTime } from "@/shared/lib/formatters";

interface DailyLimitDisplayProps {
  remaining: number; // 잔여 일일 등록 횟수
}

export default function DailyLimitDisplay({
  remaining,
}: DailyLimitDisplayProps) {
  const [countdown, setCountdown] = useState(0);

  // 횟수 초기화까지 남은 시간 조회
  const { data: ttl } = useQuery({
    queryKey: ["daily-limit-ttl"],
    queryFn: getRemainingTimeAction,
    enabled: remaining === 0,
    refetchInterval: false,
  });

  useEffect(() => {
    if (remaining === 0 && ttl) {
      setCountdown(ttl);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remaining, ttl]);

  return (
    <div className="flex flex-col gap-2 items-center text-sm font-medium">
      <span className="text-xs bg-gray-100 text-gray-800 px-3 py-0.5 rounded-full inline-flex items-center">
        <span className="mr-1">일일 아이템 등록 가능 횟수:</span>
        <span className="font-semibold text-gray-900">{remaining}</span>
        <span className="text-gray-500 mx-0.5">/</span>
        <span className="text-gray-600">{DAILY_LIMIT}</span>
      </span>

      {remaining === 0 && (
        <div className="flex flex-col gap-1 mt-1 text-xs">
          <p className="font-medium rounded-full bg-red-100 px-2 py-1 text-red-700">
            ⚠️ 일일 아이템 등록 횟수가 모두 소진되었습니다.
          </p>
          <p className="text-foreground/50">
            횟수 초기화까지 {formatTime(countdown)}
          </p>
        </div>
      )}
    </div>
  );
}
