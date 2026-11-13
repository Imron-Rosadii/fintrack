import Card from "../atoms/Card";
import { formatCurrency } from "../../utils/currency";

import type { CategoryExpense } from "./ExpenseCategoryChart";

interface TopSpendingCategoriesProps {
  data: CategoryExpense[];
  totalExpense: number;
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

function TopSpendingCategories({
  data,
  totalExpense,
}: TopSpendingCategoriesProps) {
  const topCategories = data.slice(0, 5);

  return (
    <Card>
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Top Spending Categories
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your biggest expense categories.
        </p>
      </div>

      {topCategories.length > 0 ? (
        <div className="space-y-5">
          {topCategories.map((item, index) => {
            const percentage =
              totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;

            return (
              <div key={item.category}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {index + 1}.
                    </span>

                    <span className="truncate text-sm text-gray-600 dark:text-gray-300">
                      {item.category}
                    </span>
                  </div>

                  <span className="shrink-0 whitespace-nowrap text-right text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
                    {formatCurrency(item.amount)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                </div>

                <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                  {percentage.toFixed(1)}%
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          No expense data available.
        </div>
      )}
    </Card>
  );
}

export default TopSpendingCategories;
