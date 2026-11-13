import type { ReactNode } from "react";

import Card from "../atoms/Card";
import { formatCurrency } from "../../utils/currency";

interface StatCardProps {
  title: string;
  amount: number;
  description?: string;
  icon?: ReactNode;
  iconBackground?: string;
  iconColor?: string;
  amountColor?: string;
  format?: "currency" | "percentage";
}

function StatCard({
  title,
  amount,
  description,
  icon,
  iconBackground = "bg-gray-100 dark:bg-gray-800",
  iconColor = "text-gray-600 dark:text-gray-300",
  amountColor = "text-gray-900 dark:text-white",
  format = "currency",
}: StatCardProps) {
  const formattedAmount =
    format === "percentage" ? `${amount.toFixed(1)}%` : formatCurrency(amount);

  return (
    <Card>
      <div className="min-w-0 space-y-2">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className="min-w-0 text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>

          {icon && (
            <div className={`rounded-lg p-2 ${iconBackground} ${iconColor}`}>
              {icon}
            </div>
          )}
        </div>

        <h3
          className={`wrap-break-words text-xl font-bold sm:text-2xl ${amountColor}`}
        >
          {formattedAmount}
        </h3>

        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </Card>
  );
}

export default StatCard;
