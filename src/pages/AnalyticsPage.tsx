import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

import DashboardLayout from "../components/templates/DashboardLayout";
import FinanceChart from "../components/organisms/FinanceChart";
import ExpenseCategoryChart from "../components/organisms/ExpenseCategoryChart";
import TopSpendingCategories from "../components/organisms/TopSpendingCategories";
import StatCard from "../components/molecules/StatCard";

import useAnalytics from "../hooks/useAnalytics";
import type { AnalyticsFilter } from "../hooks/useAnalytics";

interface AnalyticsPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

type AnalyticsMode = AnalyticsFilter["mode"];

function AnalyticsPage({ isDark, onToggleTheme }: AnalyticsPageProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const currentMonth = `${currentYear}-${String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const [mode, setMode] = useState<AnalyticsMode>("preset");
  const [period, setPeriod] = useState<3 | 6 | 12>(6);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [startMonth, setStartMonth] = useState(`${currentYear}-01`);

  const [endMonth, setEndMonth] = useState(currentMonth);

  const filter = useMemo<AnalyticsFilter>(() => {
    if (mode === "year") {
      return {
        mode: "year",
        year: selectedYear,
      };
    }

    if (mode === "custom") {
      return {
        mode: "custom",
        startMonth,
        endMonth,
      };
    }

    return {
      mode: "preset",
      period,
    };
  }, [mode, period, selectedYear, startMonth, endMonth]);

  const { monthlyData, summary, categoryData, availableYears } =
    useAnalytics(filter);

  const filterButtonClass = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-green-600 text-white"
        : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
    }`;

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200";

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Understand your financial performance."
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <div className="space-y-6">
        {/* Analytics Filters */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Financial Overview
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analyze your income and expenses.
            </p>
          </div>

          {/* Filter Modes */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("preset")}
              className={filterButtonClass(mode === "preset")}
            >
              Quick Period
            </button>

            <button
              type="button"
              onClick={() => setMode("year")}
              className={filterButtonClass(mode === "year")}
            >
              Year
            </button>

            <button
              type="button"
              onClick={() => setMode("custom")}
              className={filterButtonClass(mode === "custom")}
            >
              Custom
            </button>
          </div>

          {/* Quick Period */}
          {mode === "preset" && (
            <div className="flex flex-wrap gap-2">
              {([3, 6, 12] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  className={filterButtonClass(period === value)}
                >
                  Last {value} Months
                </button>
              ))}
            </div>
          )}

          {/* Year Filter */}
          {mode === "year" && (
            <div className="max-w-xs">
              <label
                htmlFor="analytics-year"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Select Year
              </label>

              <select
                id="analytics-year"
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(Number(event.target.value))
                }
                className={inputClass}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Custom Period */}
          {mode === "custom" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="analytics-start-month"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Month
                </label>

                <input
                  id="analytics-start-month"
                  type="month"
                  value={startMonth}
                  max={endMonth}
                  onChange={(event) => setStartMonth(event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="analytics-end-month"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  End Month
                </label>

                <input
                  id="analytics-end-month"
                  type="month"
                  value={endMonth}
                  min={startMonth}
                  onChange={(event) => setEndMonth(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </section>

        {/* Summary Cards */}
        <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Income"
            amount={summary.income}
            icon={<TrendingUp size={20} />}
            iconBackground="bg-green-100 dark:bg-green-500/10"
            iconColor="text-green-600 dark:text-green-400"
            amountColor="text-green-600 dark:text-green-400"
          />

          <StatCard
            title="Total Expenses"
            amount={summary.expense}
            icon={<TrendingDown size={20} />}
            iconBackground="bg-red-100 dark:bg-red-500/10"
            iconColor="text-red-600 dark:text-red-400"
            amountColor="text-red-600 dark:text-red-400"
          />

          <StatCard
            title="Net Balance"
            amount={summary.balance}
            icon={<Wallet size={20} />}
            iconBackground="bg-blue-100 dark:bg-blue-500/10"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          <StatCard
            title="Savings Rate"
            amount={summary.savingsRate}
            format="percentage"
            icon={<PiggyBank size={20} />}
            iconBackground="bg-purple-100 dark:bg-purple-500/10"
            iconColor="text-purple-600 dark:text-purple-400"
            amountColor="text-purple-600 dark:text-purple-400"
          />
        </section>

        {/* Monthly Income vs Expense */}
        <section className="min-w-0">
          <FinanceChart data={monthlyData} />
        </section>

        {/* Expense Distribution */}
        <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
          <ExpenseCategoryChart data={categoryData} />

          <TopSpendingCategories
            data={categoryData}
            totalExpense={summary.expense}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AnalyticsPage;
