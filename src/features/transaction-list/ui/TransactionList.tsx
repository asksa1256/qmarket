import { TransactionListProps } from "../model/types";

export interface TransactionPrice {
  price: number;
}

export default function TransactionList({
  payload,
  label,
}: TransactionListProps) {
  if (!payload || payload.length === 0 || !payload[0].payload) {
    return null;
  }

  const dataPoint = payload[0].payload;
  const transactions = dataPoint.transactions || [];

  return (
    <>
      <p className="mb-2 text-sm font-medium">📅 {label} 거래 내역</p>

      {transactions.length > 0 ? (
        <ol style={{ maxHeight: "150px", overflowY: "auto" }}>
          {transactions.map((tx: TransactionPrice, idx: number) => (
            <li key={idx} className="pb-0.5 text-sm text-gray-500">
              <p>- {tx.price.toLocaleString()}원</p>
            </li>
          ))}
        </ol>
      ) : (
        <p>이 날짜에는 상세 거래 내역이 없습니다.</p>
      )}
    </>
  );
}
