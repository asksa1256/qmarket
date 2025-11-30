import { DAILY_LIMIT } from "@/shared/api/redis";

interface DailyLimitDisplayProps {
  remaining: number; // 잔여 일일 등록 횟수
}

export default function DailyLimitDisplay({
  remaining,
}: DailyLimitDisplayProps) {
  return (
    <div className="flex items-center text-sm font-medium">
      <span className="text-sm bg-gray-100 text-gray-800 px-3 py-0.5 rounded-full inline-flex items-center">
        <span className="mr-1">아이템 등록 가능 횟수:</span>
        <span className="font-semibold text-gray-900">{remaining}</span>
        <span className="text-gray-500 mx-0.5">/</span>
        <span className="text-gray-600">{DAILY_LIMIT}</span>
      </span>

      {remaining === 0 && (
        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-red-700 text-xs font-semibold">
          ⚠️ 아이템 등록 횟수를 모두 사용하셨습니다. 횟수는 다음날 충전됩니다.
        </span>
      )}
    </div>
  );
}
