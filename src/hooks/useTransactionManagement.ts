import { useMemo, useState } from "react";

import useTransactions from "./useTransactions";

import type { Transaction } from "../types/transaction";
import type { TransactionFormValues } from "../schemas/transactionSchema";

function useTransactionManagement() {
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [searchTerm, setSearchTerm] = useState("");

  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all",
  );

  const [categoryFilter, setCategoryFilter] = useState("all");

  const getCurrentMonth = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    return `${now.getFullYear()}-${month}`;
  };

  const [monthFilter, setMonthFilter] = useState(getCurrentMonth);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [actionError, setActionError] = useState("");

  // Filter berdasarkan bulan dan tahun.
  const periodTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return !monthFilter || transaction.date.slice(0, 7) === monthFilter;
    });
  }, [transactions, monthFilter]);

  // Filter transaksi.
  const filteredTransactions = useMemo(() => {
    return periodTransactions.filter((transaction) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        transaction.title.toLowerCase().includes(search) ||
        transaction.category.toLowerCase().includes(search);

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [periodTransactions, searchTerm, typeFilter, categoryFilter]);

  const openCreateForm = () => {
    setEditingTransaction(null);
    setActionError("");
    setIsFormOpen(true);
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActionError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingTransaction(null);
    setActionError("");
    setIsFormOpen(false);
  };

  // Menyimpan transaksi ke Supabase.
  const handleSaveTransaction = async (
    data: TransactionFormValues,
  ): Promise<boolean> => {
    setActionError("");

    const success = editingTransaction
      ? await updateTransaction(editingTransaction.id, data)
      : await addTransaction(data);

    if (!success) {
      setActionError("Transaksi gagal disimpan. Silakan coba kembali.");
      return false;
    }

    closeForm();
    return true;
  };

  // Menghapus transaksi dari Supabase.
  const handleDeleteTransaction = async (id: string): Promise<boolean> => {
    setActionError("");

    const success = await deleteTransaction(id);

    if (!success) {
      setActionError("Transaksi gagal dihapus. Silakan coba kembali.");
      return false;
    }

    return true;
  };

  return {
    transactions,
    categories,

    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,

    monthFilter,
    setMonthFilter,
    periodTransactions,

    filteredTransactions,

    isFormOpen,
    editingTransaction,
    actionError,

    openCreateForm,
    openEditForm,
    closeForm,
    handleSaveTransaction,
    handleDeleteTransaction,
  };
}

export default useTransactionManagement;
