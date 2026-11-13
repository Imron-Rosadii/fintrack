import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedLayout from "./components/auth/ProtectedLayout";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";

// Lazy load halaman
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));

function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("fintrack-theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("fintrack-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("fintrack-theme", "light");
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((current) => !current);
  };

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500 dark:bg-gray-950 dark:text-gray-400">
          Memuat halaman...
        </div>
      }
    >
      <Routes>
        {/* Halaman khusus pengguna yang belum login */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Halaman yang membutuhkan autentikasi */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route
              path="/"
              element={
                <DashboardPage
                  isDark={isDark}
                  onToggleTheme={handleToggleTheme}
                />
              }
            />

            <Route
              path="/transactions"
              element={
                <TransactionsPage
                  isDark={isDark}
                  onToggleTheme={handleToggleTheme}
                />
              }
            />

            <Route
              path="/analytics"
              element={
                <AnalyticsPage
                  isDark={isDark}
                  onToggleTheme={handleToggleTheme}
                />
              }
            />

            <Route
              path="/categories"
              element={
                <CategoriesPage
                  isDark={isDark}
                  onToggleTheme={handleToggleTheme}
                />
              }
            />
          </Route>
        </Route>

        {/* Route tidak dikenal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
