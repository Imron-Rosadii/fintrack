import { useMemo } from "react";

import useTransactions from "./useTransactions";

import type { CategoryExpense } from "../components/organisms/ExpenseCategoryChart";

export type AnalyticsFilter =
  | {
      mode: "preset";
      period: 3 | 6 | 12;
    }
  | {
      mode: "year";
      year: number;
    }
  | {
      mode: "custom";
      startMonth: string;
      endMonth: string;
    };

function useAnalytics(filter: AnalyticsFilter) {
  const { transactions } = useTransactions();

  // Mengambil daftar tahun yang memiliki data transaksi.
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();

    const years = new Set<number>([currentYear]);

    transactions.forEach((transaction) => {
      const year = Number(transaction.date.slice(0, 4));

      if (Number.isFinite(year) && year > 0) {
        years.add(year);
      }
    });

    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  // Menentukan rentang bulan berdasarkan filter.
  const monthlyData = useMemo(() => {
    const now = new Date();

    let startDate: Date;
    let endDate: Date;

    if (filter.mode === "preset") {
      endDate = new Date(now.getFullYear(), now.getMonth(), 1);

      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - filter.period + 1,
        1,
      );
    } else if (filter.mode === "year") {
      startDate = new Date(filter.year, 0, 1);
      endDate = new Date(filter.year, 11, 1);
    } else {
      const parseMonth = (value: string) => {
        const [year, month] = value.split("-").map(Number);

        if (
          !Number.isInteger(year) ||
          !Number.isInteger(month) ||
          month < 1 ||
          month > 12
        ) {
          return null;
        }

        return new Date(year, month - 1, 1);
      };

      const parsedStart = parseMonth(filter.startMonth);
      const parsedEnd = parseMonth(filter.endMonth);

      if (!parsedStart || !parsedEnd) {
        return [];
      }

      startDate = parsedStart <= parsedEnd ? parsedStart : parsedEnd;

      endDate = parsedStart <= parsedEnd ? parsedEnd : parsedStart;
    }

    const months: {
      key: string;
      month: string;
      income: number;
      expense: number;
    }[] = [];

    const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (cursor <= endDate) {
      const year = cursor.getFullYear();
      const monthNumber = String(cursor.getMonth() + 1).padStart(2, "0");

      const key = `${year}-${monthNumber}`;

      const monthLabel =
        cursor.toLocaleDateString("en-US", {
          month: "short",
        }) + ` '${String(year).slice(-2)}`;

      months.push({
        key,
        month: monthLabel,
        income: 0,
        expense: 0,
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    const monthMap = new Map(months.map((item) => [item.key, item]));

    transactions.forEach((transaction) => {
      const key = transaction.date.slice(0, 7);
      const month = monthMap.get(key);

      if (!month) return;

      if (transaction.type === "income") {
        month.income += transaction.amount;
      } else {
        month.expense += transaction.amount;
      }
    });

    return months;
  }, [transactions, filter]);

  // Menghitung ringkasan keuangan.
  const summary = useMemo(() => {
    const income = monthlyData.reduce((total, item) => total + item.income, 0);

    const expense = monthlyData.reduce(
      (total, item) => total + item.expense,
      0,
    );

    return {
      income,
      expense,
      balance: income - expense,
      savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
    };
  }, [monthlyData]);

  // Menghitung pengeluaran berdasarkan kategori.
  const categoryData = useMemo<CategoryExpense[]>(() => {
    const categoryMap = new Map<string, number>();

    const validMonths = new Set(monthlyData.map((item) => item.key));

    transactions.forEach((transaction) => {
      if (
        transaction.type !== "expense" ||
        !validMonths.has(transaction.date.slice(0, 7))
      ) {
        return;
      }

      const currentAmount = categoryMap.get(transaction.category) ?? 0;

      categoryMap.set(transaction.category, currentAmount + transaction.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, monthlyData]);

  return {
    monthlyData,
    summary,
    categoryData,
    availableYears,
  };
}

export default useAnalytics;
