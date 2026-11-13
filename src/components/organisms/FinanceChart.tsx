import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import type { MonthlyFinance } from "../../types/transaction";
import Card from "../atoms/Card";

interface FinanceChartProps {
  data: MonthlyFinance[];
}

function FinanceChart({ data }: FinanceChartProps) {
  const chartWidth = Math.max(data.length * 76, 320);

  const formatYAxis = (value: number) => {
    if (value === 0) return "0";
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    }
    return `${value}`;
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-bold">Income vs Expenses</h3>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monthly financial overview
        </p>
      </div>

      <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain">
        <div
          style={{
            width: `max(100%, ${chartWidth}px)`,
            height: 280,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 16,
                left: 0,
                bottom: 0,
              }}
              barGap={6}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
                opacity={0.2}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                interval={0}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickFormatter={formatYAxis}
                width={45}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(148, 163, 184, 0.1)",
                }}
                formatter={(value) => {
                  const numValue = Number(value ?? 0);

                  return [`Rp ${numValue.toLocaleString("id-ID")}`];
                }}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  color: "#f8fafc",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ color: "#f8fafc" }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "8px",
                }}
                iconType="circle"
              />

              <Bar
                dataKey="income"
                name="Income"
                fill="#16a34a"
                radius={[5, 5, 0, 0]}
                barSize={24}
              />

              <Bar
                dataKey="expense"
                name="Expense"
                fill="#f87171"
                radius={[5, 5, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default FinanceChart;
