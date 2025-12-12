import { getTransactionsCount } from "../model/getTransactionsCount";
import { useQuery } from "@tanstack/react-query";
import CheckBadgeIcon from "@/shared/ui/Icon/CheckBadge";
import CheckCircle from "@/shared/ui/Icon/CheckCircle";
import { Badge } from "@/shared/ui/badge";

export default function TransactionCountDisplay({
  userId,
}: {
  userId: string;
}) {
  const {
    data: counts,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-transaction-counts", userId],
    queryFn: () => getTransactionsCount(userId),
    enabled: !!userId,
  });

  if (isPending) return null;

  if (isError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return <p className="text-center text-xs">{errorMessage}</p>;
  }

  const hasCount = counts.transactionImagesCount > 0 || counts.isSoldCount > 0;
  const trustScore = Math.round(
    (counts.transactionImagesCount / counts.isSoldCount) * 100
  );

  return (
    <>
      <div className="flex gap-2 text-xs text-center mt-2 justify-center">
        <div className="flex gap-0.5">
          <h6 className="flex items-center gap-0.5">
            <CheckBadgeIcon className="size-4 text-green-600" />
            거래 인증:
          </h6>
          <span className="font-medium text-green-700">
            {counts.transactionImagesCount ?? 0}건
          </span>
        </div>

        <div className="flex gap-0.5">
          <h6 className="flex items-center gap-0.5">
            <CheckCircle className="size-3.5 text-blue-600" />
            거래 완료:
          </h6>
          <span className="font-medium">{counts.isSoldCount ?? 0}건</span>
        </div>
      </div>
      {/* 
      {hasCount && (
        <div className="text-center mt-1">
          <Badge className="bg-green-50 text-green-700">
            신뢰지수: {trustScore.toFixed(0)}%
          </Badge>
        </div>
      )} */}
    </>
  );
}
