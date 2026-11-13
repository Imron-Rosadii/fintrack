import {
  Tags,
  Receipt,
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  HeartPulse,
  TrendingUp,
  GraduationCap,
  Wallet,
  Briefcase,
  Home,
  Coffee,
  Plane,
  Gift,
  type LucideIcon,
} from "lucide-react";

import type { CategoryAppearance } from "../../types/category";
import { DEFAULT_CATEGORY_APPEARANCE } from "../../constants/categoryAppearance";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Tags,
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  HeartPulse,
  TrendingUp,
  GraduationCap,
  Wallet,
  Briefcase,
  Home,
  Coffee,
  Plane,
  Gift,
};

interface CategoryBadgeProps {
  name: string;
  appearance?: CategoryAppearance;
  showName?: boolean;
  size?: "sm" | "md";
}

function CategoryBadge({
  name,
  appearance = DEFAULT_CATEGORY_APPEARANCE,
  showName = true,
  size = "md",
}: CategoryBadgeProps) {
  const CategoryIcon = CATEGORY_ICONS[appearance.icon] ?? Tags;

  const iconSize = size === "sm" ? 16 : 21;
  const containerSize = size === "sm" ? "size-8" : "size-11";

  return (
    <div className="inline-flex min-w-0 items-center gap-2">
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl ${containerSize} ${appearance.background} ${appearance.color}`}
      >
        <CategoryIcon size={iconSize} />
      </div>

      {showName && (
        <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {name}
        </span>
      )}
    </div>
  );
}

export default CategoryBadge;
