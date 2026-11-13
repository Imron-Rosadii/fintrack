import type { ReactNode } from "react";

import Sidebar from "../organisms/Sidebar";
import DashboardHeader from "../organisms/DashboardHeader";
import BottomNavigation from "../organisms/BottomNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

function DashboardLayout({
  children,
  title,
  subtitle,
  isDark,
  onToggleTheme,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
        />

        {/* Main Content */}
        <main className="flex-1 px-4 pt-4 pb-24 sm:px-6 sm:pb-24 lg:px-8 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default DashboardLayout;
