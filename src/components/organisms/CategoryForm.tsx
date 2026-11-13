import { Plus, Check, X } from "lucide-react";

import Card from "../atoms/Card";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

import type { CategoryAppearance } from "../../context/TransactionContext";
import { CATEGORY_ICONS } from "../molecules/CategoryBadge";

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

interface CategoryFormProps {
  categoryName: string;
  selectedIcon: string;
  selectedColor: string;
  editingCategory: string | null;
  error: string;
  onNameChange: (value: string) => void;
  onIconChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

function CategoryForm({
  categoryName,
  selectedIcon,
  selectedColor,
  editingCategory,
  error,
  onNameChange,
  onIconChange,
  onColorChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-bold">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {editingCategory
            ? "Update your category name."
            : "Create a new category for your transactions."}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
      >
        <div className="flex-1">
          <Input
            value={categoryName}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Enter category name"
            aria-label="Category name"
          />
        </div>

        {/* Icon Selection */}
        <div className="min-w-0">
          <label className="mb-1 block text-sm font-medium">
            Category Icon
          </label>

          <select
            value={selectedIcon}
            onChange={(event) => onIconChange(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            {Object.keys(CATEGORY_ICONS).map((iconName) => (
              <option key={iconName} value={iconName}>
                {iconName}
              </option>
            ))}
          </select>
        </div>

        {/* Color Selection */}
        {/* Color Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Category Color
          </label>

          <div className="flex min-h-10 flex-wrap items-center gap-3">
            {Object.entries(CATEGORY_COLORS).map(([colorName, color]) => (
              <button
                key={colorName}
                type="button"
                onClick={() => onColorChange(colorName)}
                aria-label={`Select ${colorName} color`}
                aria-pressed={selectedColor === colorName}
                className={`size-8 rounded-full ${color.background} ${
                  selectedColor === colorName
                    ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
                    : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col gap-2 sm:flex-row lg:col-span-1">
          <Button type="submit">
            {editingCategory ? (
              <>
                <Check size={16} />
                Update Category
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Category
              </>
            )}
          </Button>

          {editingCategory && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              <X size={16} />
              Cancel
            </Button>
          )}
        </div>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </Card>
  );
}

export default CategoryForm;
