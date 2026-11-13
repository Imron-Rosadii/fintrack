import { createContext } from "react";

import type { Transaction } from "../types/transaction";
import type { TransactionFormValues } from "../schemas/transactionSchema";
import type { CategoryAppearance } from "../types/category";
import type { CategoryRecord } from "../services/categoryService";

interface TransactionContextValue {
  transactions: Transaction[];
  transactionsLoading: boolean;

  summary: {
    income: number;
    expense: number;
    balance: number;
  };

  categories: string[];
  categoryRecords: CategoryRecord[];
  categoriesLoading: boolean;

  categoryAppearances: Record<string, CategoryAppearance>;

  updateCategoryAppearance: (
    name: string,
    appearance: CategoryAppearance,
  ) => Promise<boolean>;

  addTransaction: (data: TransactionFormValues) => Promise<boolean>;
  updateTransaction: (
    id: string,
    data: TransactionFormValues,
  ) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;

  addCategory: (
    name: string,
    appearance: CategoryAppearance,
  ) => Promise<boolean>;

  updateCategory: (
    oldName: string,
    newName: string,
    appearance: CategoryAppearance,
  ) => Promise<boolean>;

  deleteCategory: (name: string) => Promise<boolean>;
}

export const TransactionContext = createContext<TransactionContextValue | null>(
  null,
);
