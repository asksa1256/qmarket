"use client";

import { SaleHistory } from "@/features/item/model/getItemSaleHistory";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomChartTooltip from "@/shared/ui/CustomChartToolTip";

interface SaleHistoryChartProps {
  data: SaleHistory[];
}

export default function SaleHistoryChart({ data }: SaleHistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 border rounded-2xl">
        거래 완료 내역이 없습니다.
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
            axisLine={{ stroke: "#e0e0e0" }}
            fontSize={12}
            tickFormatter={(value) => {
              const date = new Date(value);
              date.setDate(date.getDate());
              return date.toISOString().slice(5, 10);
            }} // 날짜에서 월-일만 표시
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => {
              const absValue = Math.abs(value);

              if (absValue >= 100000000) {
                // 1억 이상: '억' 단위
                return `${(value / 100000000).toFixed(1)}억`;
              }
              if (absValue >= 10000) {
                // 1만 이상: '만' 단위
                return `${(value / 10000).toFixed(0)}만`;
              }
              // 그 외 (1000원대 포함)는 그대로 표시
              return `${value.toFixed(0)}`;
            }}
          />
          <Tooltip content={<CustomChartTooltip />} />
          <Line
            type="monotone"
            dataKey="avgPrice"
            name="거래 가격"
            stroke="#3b82f6"
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            fill="#3b82f6"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
