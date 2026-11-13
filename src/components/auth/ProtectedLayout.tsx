import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

const TransactionProvider = lazy(() =>
  import("../../context/TransactionProvider").then((module) => ({
    default: module.TransactionProvider,
  })),
);

function ProtectedLayout() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500 dark:bg-gray-950 dark:text-gray-400">
          Memuat data keuangan...
        </div>
      }
    >
      <TransactionProvider>
        <Outlet />
      </TransactionProvider>
    </Suspense>
  );
}

export default ProtectedLayout;
