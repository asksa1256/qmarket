"use client";

import { SaleHistory } from "@/shared/lib/getItemSaleHistory";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SaleHistoryChartProps {
  data: SaleHistory[];
  itemName: string;
}

// 툴팁의 내용 포맷을 사용자 정의합니다.
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const price = payload[0].value.toLocaleString();
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg">
        <p className="font-bold text-sm text-gray-700">{label}</p>
        <p className="text-sm text-blue-600">거래 가격: {price}원</p>
      </div>
    );
  }
  return null;
};

export default function SaleHistoryChart({
  data,
  itemName,
}: SaleHistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        최근 {itemName}의 판매 완료 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={{ stroke: "#e0ee0" }}
            fontSize={12}
            tickFormatter={(value) => value.slice(5)} // 날짜에서 월-일만 표시
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `${(value / 100000000).toFixed(1)}억`} // 억 단위로 포맷
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="averagePrice"
            name="거래 가격"
            stroke="#3b82f6" // Tailwind blue-500
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
