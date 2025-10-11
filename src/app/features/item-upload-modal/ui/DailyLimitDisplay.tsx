import { DAILY_LIMIT } from "@/shared/lib/redis";

interface DailyLimitDisplayProps {
  remaining: number; // 잔여 일일 등록 횟수
}

export default function DailyLimitDisplay({
  remaining,
}: DailyLimitDisplayProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className="text-gray-700">
        아이템 등록 가능 횟수: <span className="font-bold">{remaining}</span>/
        {DAILY_LIMIT}
      </span>

      {remaining === 0 && (
        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-red-700 text-xs font-semibold">
          ⚠️ 아이템 등록 횟수를 모두 사용하셨습니다. 횟수는 다음날 모두
          충전됩니다.
        </span>
      )}
    </div>
  );
}
