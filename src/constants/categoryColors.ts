import type { CategoryAppearance } from "../types/category";

export const CATEGORY_COLORS: Record<
  string,
  Pick<CategoryAppearance, "color" | "background">
> = {
  green: {
    color: "text-green-600 dark:text-green-400",
    background: "bg-green-100 dark:bg-green-900/30",
  },
  blue: {
    color: "text-blue-600 dark:text-blue-400",
    background: "bg-blue-100 dark:bg-blue-900/30",
  },
  purple: {
    color: "text-purple-600 dark:text-purple-400",
    background: "bg-purple-100 dark:bg-purple-900/30",
  },
  red: {
    color: "text-red-600 dark:text-red-400",
    background: "bg-red-100 dark:bg-red-900/30",
  },
  orange: {
    color: "text-orange-600 dark:text-orange-400",
    background: "bg-orange-100 dark:bg-orange-900/30",
  },
  gray: {
    color: "text-gray-600 dark:text-gray-300",
    background: "bg-gray-100 dark:bg-gray-800",
  },
};
