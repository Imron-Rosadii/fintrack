import { Tags, Receipt, Check } from "lucide-react";

import Card from "../atoms/Card";

interface CategoryStatsProps {
  totalCategories: number;
  totalTransactions: number;
  activeCategories: number;
}

function CategoryStats({
  totalCategories,
  totalTransactions,
  activeCategories,
}: CategoryStatsProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Categories
            </p>
            <h2 className="mt-2 text-2xl font-bold">{totalCategories}</h2>
          </div>

          <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
            <Tags size={24} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Transactions
            </p>
            <h2 className="mt-2 text-2xl font-bold">{totalTransactions}</h2>
          </div>

          <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30">
            <Receipt size={24} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Active Categories
            </p>
            <h2 className="mt-2 text-2xl font-bold">{activeCategories}</h2>
          </div>

          <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30">
            <Check size={24} />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CategoryStats;
