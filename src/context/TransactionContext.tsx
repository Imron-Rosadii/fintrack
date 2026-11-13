import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Transaction } from "../types/transaction";
import type { TransactionFormValues } from "../schemas/transactionSchema";

import { useAuth } from "./AuthContext";

import {
  createCategory as createCategoryRecord,
  updateCategory as updateCategoryRecord,
  deleteCategory as deleteCategoryRecord,
  ensureDefaultCategories,
  type CategoryRecord,
  type CategoryInput,
} from "../services/categoryService";

import {
  getTransactions,
  createTransaction as createTransactionRecord,
  updateTransaction as updateTransactionRecord,
  deleteTransaction as deleteTransactionRecord,
  type TransactionRecord,
} from "../services/transactionService";

export interface CategoryAppearance {
  icon: string;
  color: string;
  background: string;
}

export const DEFAULT_CATEGORY_APPEARANCE: CategoryAppearance = {
  icon: "Tags",
  color: "text-gray-600 dark:text-gray-300",
  background: "bg-gray-100 dark:bg-gray-800",
};

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

interface TransactionProviderProps {
  children: ReactNode;
}

// Mengubah record Supabase menjadi format yang digunakan UI.
function mapTransaction(
  record: TransactionRecord,
  categoryName: string,
): Transaction {
  return {
    id: record.id,
    title: record.title,
    category: categoryName,
    amount: Number(record.amount),
    type: record.type,
    date: record.date,
  };
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const { user, loading: authLoading } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const [categoryRecords, setCategoryRecords] = useState<CategoryRecord[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Memuat kategori dan transaksi milik pengguna yang login.
  useEffect(() => {
    let cancelled = false;

    if (authLoading) {
      return;
    }

    if (!user) {
      setCategoryRecords([]);
      setTransactions([]);
      setCategoriesLoading(false);
      setTransactionsLoading(false);
      return;
    }

    setCategoryRecords([]);
    setTransactions([]);
    setCategoriesLoading(true);
    setTransactionsLoading(true);

    async function loadData() {
      try {
        const [categoryData, transactionData] = await Promise.all([
          ensureDefaultCategories(),
          getTransactions(),
        ]);

        if (cancelled) return;

        setCategoryRecords(categoryData);

        const categoryMap = new Map(
          categoryData.map((category) => [category.id, category.name]),
        );

        const mappedTransactions = transactionData
          .map((record) => {
            const categoryName = categoryMap.get(record.category_id);

            // Abaikan transaksi jika kategori tidak ditemukan.
            if (!categoryName) return null;

            return mapTransaction(record, categoryName);
          })
          .filter((item): item is Transaction => item !== null);

        setTransactions(mappedTransactions);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load finance data:", error);
          setCategoryRecords([]);
          setTransactions([]);
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
          setTransactionsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  // Nama kategori diturunkan dari record Supabase.
  const categories = useMemo(
    () => categoryRecords.map((category) => category.name),
    [categoryRecords],
  );

  // Ikon dan warna kategori diturunkan dari record Supabase.
  const categoryAppearances = useMemo(
    () =>
      Object.fromEntries(
        categoryRecords.map((category) => [
          category.name,
          {
            icon: category.icon,
            color: category.color,
            background: category.background,
          },
        ]),
      ),
    [categoryRecords],
  );

  // Menghitung ringkasan keuangan.
  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((total, item) => total + item.amount, 0);

    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((total, item) => total + item.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  // Menambahkan transaksi ke Supabase.
  const addTransaction = useCallback(
    async (data: TransactionFormValues): Promise<boolean> => {
      if (!user) return false;

      const category = categoryRecords.find(
        (item) => item.name === data.category,
      );

      if (!category) return false;

      try {
        const newRecord = await createTransactionRecord({
          category_id: category.id,
          title: data.title,
          amount: data.amount,
          type: data.type,
          date: data.date,
        });

        const newTransaction = mapTransaction(newRecord, category.name);

        setTransactions((current) => [newTransaction, ...current]);

        return true;
      } catch (error) {
        console.error("Failed to create transaction:", error);
        return false;
      }
    },
    [categoryRecords, user],
  );

  // Mengubah transaksi di Supabase.
  const updateTransaction = useCallback(
    async (id: string, data: TransactionFormValues): Promise<boolean> => {
      if (!user) return false;

      const category = categoryRecords.find(
        (item) => item.name === data.category,
      );

      if (!category) return false;

      try {
        const updatedRecord = await updateTransactionRecord(id, {
          category_id: category.id,
          title: data.title,
          amount: data.amount,
          type: data.type,
          date: data.date,
        });

        const updatedTransaction = mapTransaction(updatedRecord, category.name);

        setTransactions((current) =>
          current.map((item) => (item.id === id ? updatedTransaction : item)),
        );

        return true;
      } catch (error) {
        console.error("Failed to update transaction:", error);
        return false;
      }
    },
    [categoryRecords, user],
  );

  // Menghapus transaksi dari Supabase.
  const deleteTransaction = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) return false;

      try {
        await deleteTransactionRecord(id);

        setTransactions((current) => current.filter((item) => item.id !== id));

        return true;
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        return false;
      }
    },
    [user],
  );

  // Menambahkan kategori beserta ikon dan warna ke Supabase.
  const addCategory = useCallback(
    async (name: string, appearance: CategoryAppearance): Promise<boolean> => {
      const trimmedName = name.trim();

      if (!trimmedName || !user) return false;

      const exists = categoryRecords.some(
        (category) => category.name.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (exists) return false;

      const categoryInput: CategoryInput = {
        name: trimmedName,
        ...appearance,
      };

      try {
        const newCategory = await createCategoryRecord(categoryInput);

        setCategoryRecords((current) => [...current, newCategory]);

        return true;
      } catch (error) {
        console.error("Failed to create category:", error);
        return false;
      }
    },
    [categoryRecords, user],
  );

  // Mengubah nama, ikon, dan warna kategori di Supabase.
  const updateCategory = useCallback(
    async (
      oldName: string,
      newName: string,
      appearance: CategoryAppearance,
    ): Promise<boolean> => {
      const trimmedName = newName.trim();

      if (!trimmedName || !user) return false;

      const existingCategory = categoryRecords.find(
        (category) => category.name === oldName,
      );

      if (!existingCategory) return false;

      const duplicate = categoryRecords.some(
        (category) =>
          category.name.toLowerCase() === trimmedName.toLowerCase() &&
          category.id !== existingCategory.id,
      );

      if (duplicate) return false;

      try {
        const updatedCategory = await updateCategoryRecord(
          existingCategory.id,
          {
            name: trimmedName,
            ...appearance,
          },
        );

        setCategoryRecords((current) =>
          current.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
        );

        // Memperbarui nama kategori pada transaksi di state UI.
        setTransactions((current) =>
          current.map((transaction) =>
            transaction.category === oldName
              ? { ...transaction, category: trimmedName }
              : transaction,
          ),
        );

        return true;
      } catch (error) {
        console.error("Failed to update category:", error);
        return false;
      }
    },
    [categoryRecords, user],
  );

  // Menghapus kategori dari Supabase.
  const deleteCategory = useCallback(
    async (name: string): Promise<boolean> => {
      if (!user) return false;

      const isUsed = transactions.some(
        (transaction) => transaction.category === name,
      );

      if (isUsed) return false;

      const category = categoryRecords.find((item) => item.name === name);

      if (!category) return false;

      try {
        await deleteCategoryRecord(category.id);

        setCategoryRecords((current) =>
          current.filter((item) => item.id !== category.id),
        );

        return true;
      } catch (error) {
        console.error("Failed to delete category:", error);
        return false;
      }
    },
    [categoryRecords, transactions, user],
  );

  // Mengubah ikon dan warna kategori di Supabase.
  const updateCategoryAppearance = useCallback(
    async (name: string, appearance: CategoryAppearance): Promise<boolean> => {
      if (!user) return false;

      const category = categoryRecords.find((item) => item.name === name);

      if (!category) return false;

      try {
        const updatedCategory = await updateCategoryRecord(
          category.id,
          appearance,
        );

        setCategoryRecords((current) =>
          current.map((item) =>
            item.id === updatedCategory.id ? updatedCategory : item,
          ),
        );

        return true;
      } catch (error) {
        console.error("Failed to update category appearance:", error);
        return false;
      }
    },
    [categoryRecords, user],
  );

  const value = useMemo(
    () => ({
      transactions,
      transactionsLoading,
      summary,
      categories,
      categoryRecords,
      categoriesLoading,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      categoryAppearances,
      updateCategoryAppearance,
    }),
    [
      transactions,
      transactionsLoading,
      summary,
      categories,
      categoryRecords,
      categoriesLoading,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      categoryAppearances,
      updateCategoryAppearance,
    ],
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
