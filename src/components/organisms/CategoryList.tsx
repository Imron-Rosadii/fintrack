import {
  Tags,
  Pencil,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import Card from "../atoms/Card";
import Button from "../atoms/Button";
import CategoryBadge from "../molecules/CategoryBadge";

import type { CategoryAppearance } from "../../types/category";
import { DEFAULT_CATEGORY_APPEARANCE } from "../../constants/categoryAppearance";

import { formatCurrency } from "../../utils/currency";

export interface CategoryStat {
  name: string;
  transactionCount: number;
  income: number;
  expense: number;
  total: number;
}

interface CategoryListProps {
  categoryStats: CategoryStat[];
  categoryAppearances: Record<string, CategoryAppearance>;
  onEdit: (category: string) => void;
  onDelete: (category: string) => void;
}

function CategoryList({
  categoryStats,
  categoryAppearances,
  onEdit,
  onDelete,
}: CategoryListProps) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-bold">All Categories</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your category usage and financial activity.
        </p>
      </div>

      {categoryStats.length === 0 ? (
        <div className="py-12 text-center">
          <Tags size={40} className="mx-auto mb-3 text-gray-400" />
          <p className="font-medium">No categories found</p>
          <p className="mt-1 text-sm text-gray-500">
            Add your first category above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryStats.map((category) => (
            <div
              key={category.name}
              className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <CategoryBadge
                  name={category.name}
                  appearance={
                    categoryAppearances[category.name] ??
                    DEFAULT_CATEGORY_APPEARANCE
                  }
                  showName={false}
                />

                <div className="min-w-0 flex-1">
                  <h3 className="wrap-break-word font-semibold">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {category.transactionCount} transactions
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <ArrowUpCircle size={16} className="text-green-500" />
                      <span className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatCurrency(category.income)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm">
                      <ArrowDownCircle size={16} className="text-red-500" />
                      <span className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatCurrency(category.expense)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
                <div className="min-w-0 text-left sm:text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Activity
                  </p>
                  <p className="mt-1 whitespace-nowrap text-sm font-semibold sm:text-base">
                    {formatCurrency(category.total)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(category.name)}
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil size={15} />
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(category.name)}
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default CategoryList;
