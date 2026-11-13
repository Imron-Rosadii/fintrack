import { useMemo, useState } from "react";

import DashboardLayout from "../components/templates/DashboardLayout";
import CategoryStats from "../components/organisms/CategoryStats";
import ConfirmDialog from "../components/molecules/ConfirmDialog";
import CategoryList from "../components/organisms/CategoryList";

import useTransactions from "../hooks/useTransactions";
import { DEFAULT_CATEGORY_APPEARANCE } from "../context/TransactionContext";

import CategoryForm, {
  CATEGORY_COLORS,
} from "../components/organisms/CategoryForm";

interface CategoriesPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function CategoriesPage({ isDark, onToggleTheme }: CategoriesPageProps) {
  const {
    categories,
    transactions,
    addCategory,
    updateCategory,
    deleteCategory,
    categoryAppearances,
  } = useTransactions();

  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Tags");
  const [selectedColor, setSelectedColor] = useState("gray");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const categoryStats = useMemo(() => {
    return categories.map((category) => {
      const categoryTransactions = transactions.filter(
        (transaction) => transaction.category === category,
      );

      const income = categoryTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, item) => total + item.amount, 0);

      const expense = categoryTransactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, item) => total + item.amount, 0);

      return {
        name: category,
        transactionCount: categoryTransactions.length,
        income,
        expense,
        total: income + expense,
      };
    });
  }, [categories, transactions]);

  const totalTransactions = transactions.length;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setError("Category name cannot be empty.");
      return;
    }

    const appearance = {
      icon: selectedIcon,
      ...CATEGORY_COLORS[selectedColor],
    };

    const success = editingCategory
      ? await updateCategory(editingCategory, trimmedName, appearance)
      : await addCategory(trimmedName, appearance);

    if (!success) {
      setError(
        "Category already exists or the operation could not be completed.",
      );
      return;
    }

    resetForm();
  };

  const resetForm = () => {
    setCategoryName("");
    setEditingCategory(null);
    setSelectedIcon("Tags");
    setSelectedColor("gray");
    setError("");
  };

  const handleEdit = (category: string) => {
    const appearance =
      categoryAppearances[category] ?? DEFAULT_CATEGORY_APPEARANCE;

    setEditingCategory(category);
    setCategoryName(category);
    setSelectedIcon(appearance.icon);

    const matchingColor = Object.entries(CATEGORY_COLORS).find(
      ([, value]) =>
        value.color === appearance.color &&
        value.background === appearance.background,
    );

    setSelectedColor(matchingColor?.[0] ?? "gray");
    setError("");
  };
  const handleDelete = (category: string) => {
    setPendingDelete(category);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    const categoryToDelete = pendingDelete;
    const success = await deleteCategory(categoryToDelete);

    if (!success) {
      setError(
        `"${categoryToDelete}" could not be deleted. Make sure no transactions use this category, then try again.`,
      );
    } else {
      setError("");
    }

    setPendingDelete(null);
    setIsDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setPendingDelete(null);
    setIsDeleteOpen(false);
  };

  return (
    <DashboardLayout
      title="Categories"
      subtitle="Manage your income and expense categories."
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <div className="space-y-6">
        {/* Summary */}
        <CategoryStats
          totalCategories={categories.length}
          totalTransactions={totalTransactions}
          activeCategories={
            categoryStats.filter((category) => category.transactionCount > 0)
              .length
          }
        />

        {/* Category Form */}
        <CategoryForm
          categoryName={categoryName}
          selectedIcon={selectedIcon}
          selectedColor={selectedColor}
          editingCategory={editingCategory}
          error={error}
          onNameChange={(value) => {
            setCategoryName(value);
            setError("");
          }}
          onIconChange={setSelectedIcon}
          onColorChange={setSelectedColor}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        {/* Category List */}
        <CategoryList
          categoryStats={categoryStats}
          categoryAppearances={categoryAppearances}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Category?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete}"? This action cannot be undone.`
            : "Are you sure you want to delete this category?"
        }
        confirmLabel="Delete Category"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </DashboardLayout>
  );
}

export default CategoriesPage;
