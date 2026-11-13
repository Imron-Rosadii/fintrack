import { lazy, Suspense, useState } from "react";
import { Plus } from "lucide-react";

import DashboardLayout from "../components/templates/DashboardLayout";
import StatCard from "../components/molecules/StatCard";
import Button from "../components/atoms/Button";
import Card from "../components/atoms/Card";

const FinanceChart = lazy(() => import("../components/organisms/FinanceChart"));
import TransactionForm from "../components/organisms/TransactionForm";
import TransactionFilters from "../components/organisms/TransactionFilters";
import TransactionTable from "../components/organisms/TransactionTable";
import useTransactionManagement from "../hooks/useTransactionManagement";

import useTransactions from "../hooks/useTransactions";
import useAnalytics from "../hooks/useAnalytics";

import Modal from "../components/molecules/Modal";
import ConfirmDialog from "../components/molecules/ConfirmDialog";

interface DashboardPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function DashboardPage({ isDark, onToggleTheme }: DashboardPageProps) {
  const { summary } = useTransactions();
  const { monthlyData } = useAnalytics({
    mode: "preset",
    period: 6,
  });

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
  } = useTransactionManagement();

  const [deletingTransactionId, setDeletingTransactionId] = useState<
    string | null
  >(null);

  const handleConfirmDelete = () => {
    if (!deletingTransactionId) return;

    handleDeleteTransaction(deletingTransactionId);
    setDeletingTransactionId(null);
  };

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Overview of your monthly balance, income, and expenses."
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <div className="min-w-0 space-y-6">
        <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Total Balance" amount={summary.balance} />

          <StatCard title="Total Income" amount={summary.income} />

          <StatCard title="Total Expense" amount={summary.expense} />
        </section>

        <Suspense
          fallback={
            <Card>
              <div className="flex h-72 items-center justify-center text-sm text-gray-500">
                Loading chart...
              </div>
            </Card>
          }
        >
          <FinanceChart data={monthlyData} />
        </Suspense>

        <Card>
          <div className="min-w-0 space-y-5">
            <div className="flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Transactions
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kelola seluruh transaksi keuanganmu.
                </p>
              </div>

              <Button onClick={openCreateForm} className="w-full sm:w-auto">
                <Plus size={16} />
                Add Transaction
              </Button>
            </div>

            <Modal
              isOpen={isFormOpen}
              title={
                editingTransaction ? "Edit Transaction" : "New Transaction"
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

            <TransactionFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              categories={categories}
            />

            <TransactionTable
              transactions={filteredTransactions}
              onEdit={openEditForm}
              onDelete={(id) => setDeletingTransactionId(id)}
            />

            <ConfirmDialog
              isOpen={deletingTransactionId !== null}
              onConfirm={handleConfirmDelete}
              onCancel={() => setDeletingTransactionId(null)}
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
