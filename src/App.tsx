import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { TransactionProvider } from "./context/TransactionContext";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CategoriesPage from "./pages/CategoriesPage";

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
    <TransactionProvider>
      <Routes>
        {/* Halaman publik */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Halaman yang membutuhkan autentikasi */}
        <Route element={<ProtectedRoute />}>
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

        {/* Route tidak dikenal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TransactionProvider>
  );
}

export default App;
