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

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg w-auto">
        <p className="text-sm">
          🧮 평균 거래 가격:{" "}
          <span className="text-blue-600 font-bold">{formattedAvgPrice}원</span>
        </p>
        {/* <TransactionList payload={payload} label={label!} />{" "} */}
      </div>
    );
  }
  return null;
}
