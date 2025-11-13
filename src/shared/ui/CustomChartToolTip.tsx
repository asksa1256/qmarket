import TransactionList from "@/features/transaction-list/ui/TransactionList";
import { SaleHistory } from "../lib/getItemSaleHistory";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: SaleHistory }[];
  label?: string;
}

export default function CustomChartTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const avgPrice = payload[0].value.toFixed(0);
    const formattedAvgPrice = Number(avgPrice).toLocaleString();

    const date = new Date(payload[0].payload.date);
    date.setDate(date.getDate());
    const formattedDate = date.toISOString().slice(0, 10);

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg w-auto">
        <p className="flex flex-col text-sm">
          <span>🧮 {formattedDate}</span>
          <span>
            평균 거래가: <b className="text-blue-600">{formattedAvgPrice}원</b>
          </span>
        </p>
        {/* <TransactionList payload={payload} label={label!} />{" "} */}
      </div>
    );
  }
  return null;
}
