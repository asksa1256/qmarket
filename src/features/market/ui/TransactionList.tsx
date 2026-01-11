import { TransactionListProps } from "../model/transactionTypes";
import { formatKST } from "@/shared/lib/formatters";

interface Transaction {
  price: number;
  updated_at: string;
}

export default function TransactionList({ payload }: TransactionListProps) {
  if (!payload || payload.length === 0 || !payload[0].payload) {
    return null;
  }

  const dataPoint = payload[0].payload;
  const transactions = dataPoint.transactions || [];

  return (
    <div className="mt-2">
      <hr />
      <p className="mt-2 text-sm font-medium">📜 거래 내역</p>

      {transactions.length > 0 ? (
        <ol className="max-h-[150px] overflow-y-auto">
          {transactions.map((tx: Transaction, idx: number) => (
            <li key={idx} className="pb-0.5 text-xs text-foreground/50">
              <p>
                · {tx.price.toLocaleString()}원{" "}
                <span className="text-xs text-foreground/30">
                  ({formatKST(tx.updated_at).slice(11)})
                </span>
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p>상세 거래 내역이 없습니다.</p>
      )}
    </div>
  );
}
