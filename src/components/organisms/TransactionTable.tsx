import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatCurrency } from "../../utils/currency";
import type { Transaction } from "../../types/transaction";

import TransactionActions from "../molecules/TransactionActions";
import Badge from "../atoms/Badge";

import CategoryBadge from "../molecules/CategoryBadge";
import useTransactions from "../../hooks/useTransactions";

import { DEFAULT_CATEGORY_APPEARANCE } from "../../context/TransactionContext";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

type PageItem = number | "...";

function getPageNumbers(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const { categoryAppearances } = useTransactions();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalTransactions = transactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);

  // Kembali ke halaman pertama ketika hasil pencarian/filter berubah.
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalTransactions);

  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  if (totalTransactions === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 px-4 py-12 text-center dark:border-gray-700">
        <p className="font-medium text-gray-700 dark:text-gray-300">
          No transactions found
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Coba ubah kata kunci pencarian atau filter transaksi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="w-full overflow-x-auto overscroll-x-contain rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full min-w-175 text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/70">
            <tr className="text-gray-500 dark:text-gray-400">
              <th className="sticky left-0 z-10 min-w-48 bg-gray-50 px-5 py-4 font-medium dark:bg-gray-800">
                Transaction
              </th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 text-right font-medium">Amount</th>
              <th className="px-5 py-4 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
              >
                <td className="sticky left-0 z-10 min-w-48 bg-white px-5 py-4 font-medium text-gray-900 dark:bg-gray-900 dark:text-white">
                  {transaction.title}
                </td>

                <td className="px-5 py-4">
                  <CategoryBadge
                    name={transaction.category}
                    appearance={
                      categoryAppearances[transaction.category] ??
                      DEFAULT_CATEGORY_APPEARANCE
                    }
                    size="sm"
                  />
                </td>

                <td className="px-5 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  {transaction.date}
                </td>

                <td className="px-5 py-4">
                  <Badge
                    variant={
                      transaction.type === "income" ? "success" : "danger"
                    }
                  >
                    {transaction.type}
                  </Badge>
                </td>

                <td
                  className={`px-5 py-4 text-right font-semibold whitespace-nowrap ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center">
                    <TransactionActions
                      onEdit={() => onEdit(transaction)}
                      onDelete={() => onDelete(transaction.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {startIndex + 1}–{endIndex}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {totalTransactions}
            </span>{" "}
            transactions
          </span>

          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(1);
            }}
            aria-label="Transactions per page"
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none transition focus:border-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ChevronLeft size={18} />
          </button>

          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="flex size-9 items-center justify-center text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className={`flex size-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionTable;
