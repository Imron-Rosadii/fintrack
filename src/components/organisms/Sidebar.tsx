import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Tags,
  Settings,
  Wallet,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: Tags,
  },
];

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:block">
      <div className="mb-12 flex items-center gap-3">
        <div className="rounded-xl bg-green-600 p-3 text-white">
          <Wallet size={22} />
        </div>

        <h1 className="text-xl font-bold">FinTrack</h1>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Main Menu
      </p>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Preferences
        </p>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
        >
          <Settings size={19} />
          Settings
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
