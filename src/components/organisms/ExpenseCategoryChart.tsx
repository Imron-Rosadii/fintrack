import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import Card from "../atoms/Card";
import { formatCurrency } from "../../utils/currency";

export interface CategoryExpense {
  category: string;
  amount: number;
}

interface ExpenseCategoryChartProps {
  data: CategoryExpense[];
}

const CHART_COLORS = [
  "#16a34a",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#64748b",
];

function ExpenseCategoryChart({ data }: ExpenseCategoryChartProps) {
  return (
    <Card>
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Expenses by Category
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Spending distribution for the selected period.
        </p>
      </div>

      {data.length > 0 ? (
        <>
          <div className="h-64 w-full min-w-0 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius="45%"
                  outerRadius="70%"
                  paddingAngle={3}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.category}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.map((item, index) => (
              <div
                key={item.category}
                className="flex min-w-0 items-center gap-2"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />

                <span className="truncate text-sm text-gray-600 dark:text-gray-300">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          No expense data available.
        </div>
      )}
    </Card>
  );
}

export default ExpenseCategoryChart;
