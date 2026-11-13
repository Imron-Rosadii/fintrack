import { useMemo, useState } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";

import DashboardLayout from "../components/templates/DashboardLayout";
import TransactionFilters from "../components/organisms/TransactionFilters";
import TransactionTable from "../components/organisms/TransactionTable";
import TransactionForm from "../components/organisms/TransactionForm";

import StatCard from "../components/molecules/StatCard";
import Modal from "../components/molecules/Modal";
import ConfirmDialog from "../components/molecules/ConfirmDialog";

import { Download } from "lucide-react";
import { exportTransactionsPdf } from "../utils/exportTransactionsPdf";

import useTransactionManagement from "../hooks/useTransactionManagement";
interface TransactionsPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function TransactionsPage({ isDark, onToggleTheme }: TransactionsPageProps) {
  const {
    categories,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    filteredTransactions,
    isFormOpen,
    editingTransaction,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSaveTransaction,
    handleDeleteTransaction,
    actionError,
    monthFilter,
    setMonthFilter,
    periodTransactions,
  } = useTransactionManagement();

  const summary = useMemo(() => {
    const income = periodTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = periodTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [periodTransactions]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const handleDeleteRequest = (id: string) => {
    setSelectedTransactionId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransactionId) return;

    const success = await handleDeleteTransaction(selectedTransactionId);

    if (success) {
      setSelectedTransactionId(null);
      setIsDeleteOpen(false);
    }
  };
  const handleCancelDelete = () => {
    setSelectedTransactionId(null);
    setIsDeleteOpen(false);
  };

  return (
    <DashboardLayout
      title="Transactions"
      subtitle="Manage all your income and expenses."
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <div className="space-y-6">
        {/* Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
        </section>

        {/* Transaction List */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Transactions
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filteredTransactions.length} transactions found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={async () => {
                  await exportTransactionsPdf({
                    transactions: filteredTransactions,
                    monthFilter,
                    income: filteredTransactions
                      .filter((item) => item.type === "income")
                      .reduce((total, item) => total + item.amount, 0),
                    expense: filteredTransactions
                      .filter((item) => item.type === "expense")
                      .reduce((total, item) => total + item.amount, 0),
                    balance:
                      filteredTransactions
                        .filter((item) => item.type === "income")
                        .reduce((total, item) => total + item.amount, 0) -
                      filteredTransactions
                        .filter((item) => item.type === "expense")
                        .reduce((total, item) => total + item.amount, 0),
                  });
                }}
                disabled={filteredTransactions.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Download size={18} />
                Download PDF
              </button>

              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
              >
                <Plus size={18} />
                Add Transaction
              </button>
            </div>
          </div>

          {/* Filters */}
          {/* Month Filter */}
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-xs">
              <label
                htmlFor="monthFilter"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Filter by Month
              </label>

              <input
                id="monthFilter"
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {monthFilter && (
              <button
                type="button"
                onClick={() => setMonthFilter("")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                All Periods
              </button>
            )}
          </div>

          {/* Other Filters */}
          <div className="mb-5">
            <TransactionFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              categories={categories}
            />
          </div>

          {actionError && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {actionError}
            </p>
          )}

          {/* Table */}
          <TransactionTable
            key={JSON.stringify([
              searchTerm,
              typeFilter,
              categoryFilter,
              monthFilter,
              filteredTransactions,
            ])}
            transactions={filteredTransactions}
            onEdit={openEditForm}
            onDelete={handleDeleteRequest}
          />
        </section>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        subtitle={
          editingTransaction
            ? "Update your transaction information."
            : "Enter the details of your new transaction."
        }
        onClose={closeForm}
      >
        <TransactionForm
          categories={categories}
          initialData={editingTransaction}
          onSubmit={handleSaveTransaction}
          onCancel={closeForm}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Transaction?"
        message="This transaction will be permanently deleted. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </DashboardLayout>
  );
}

export default TransactionsPage;
