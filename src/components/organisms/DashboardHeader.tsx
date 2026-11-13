import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Moon, Sun, User, LogOut, ChevronDown } from "lucide-react";

import useAuth from "../../hooks/useAuth";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

function DashboardHeader({
  title = "Dashboard",
  subtitle = "You can manage your income and expense here.",
  isDark,
  onToggleTheme,
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    const { error } = await signOut();

    setIsSigningOut(false);

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    navigate("/login", { replace: true });
  };

  const userEmail = user?.email ?? "User";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <header className="w-full px-4 pt-6 pb-2 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Judul Halaman */}
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0">
            <h1 className="wrap-break-word text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              {title}
            </h1>

            <p className="mt-1 wrap-break-word text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex shrink-0 items-center justify-end gap-2.5 sm:gap-3">
          {/* Theme Switcher */}
          <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <button
              type="button"
              onClick={() => isDark && onToggleTheme()}
              aria-label="Light mode"
              title="Light mode"
              className={`flex size-7 items-center justify-center rounded-lg transition ${
                !isDark
                  ? "bg-green-500 text-white shadow-xs"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              }`}
            >
              <Sun size={15} />
            </button>

            <button
              type="button"
              onClick={() => !isDark && onToggleTheme()}
              aria-label="Dark mode"
              title="Dark mode"
              className={`flex size-7 items-center justify-center rounded-lg transition ${
                isDark
                  ? "bg-green-600 text-white shadow-xs"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              }`}
            >
              <Moon size={15} />
            </button>
          </div>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            title="Notifications"
            className="relative flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-xs transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Bell size={17} />
            <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-green-500" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((current) => !current)}
              aria-label="User profile"
              aria-expanded={isProfileOpen}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xs transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-green-100 text-sm font-semibold text-green-700 dark:bg-green-950 dark:text-green-400">
                {userInitial}
              </span>

              <ChevronDown
                size={14}
                className="text-gray-500 dark:text-gray-400"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Signed in as
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-gray-900 dark:text-white">
                    {userEmail}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  {isSigningOut ? <User size={16} /> : <LogOut size={16} />}

                  {isSigningOut ? "Signing out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
