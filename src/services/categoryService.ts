import { supabase } from "../lib/supabase";

export interface CategoryRecord {
  id: string;
  name: string;
  icon: string;
  color: string;
  background: string;
  created_at: string;
}

export type CategoryInput = Pick<
  CategoryRecord,
  "name" | "icon" | "color" | "background"
>;

const CATEGORY_COLUMNS = "id, name, icon, color, background, created_at";

// Mengambil semua kategori milik pengguna yang sedang login
export async function getCategories(): Promise<CategoryRecord[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

// Menambahkan kategori baru
export async function createCategory(
  category: CategoryInput,
): Promise<CategoryRecord> {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select(CATEGORY_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Mengubah kategori
export async function updateCategory(
  id: string,
  category: Partial<CategoryInput>,
): Promise<CategoryRecord> {
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select(CATEGORY_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Menghapus kategori
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw error;
  }
}

const DEFAULT_APPEARANCE = {
  icon: "Tags",
  color: "text-gray-600 dark:text-gray-300",
  background: "bg-gray-100 dark:bg-gray-800",
};

const DEFAULT_CATEGORIES = [
  "Salary",
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Health",
  "Investment",
  "Education",
  "Freelance",
  "Other",
];

export async function ensureDefaultCategories(): Promise<CategoryRecord[]> {
  // Periksa kategori milik pengguna yang sedang login.
  const existingCategories = await getCategories();

  // Jika sudah ada, jangan membuat ulang.
  if (existingCategories.length > 0) {
    return existingCategories;
  }

  const defaultCategories: CategoryInput[] = DEFAULT_CATEGORIES.map((name) => ({
    name,
    icon: DEFAULT_APPEARANCE.icon,
    color: DEFAULT_APPEARANCE.color,
    background: DEFAULT_APPEARANCE.background,
  }));

  const { data, error } = await supabase
    .from("categories")
    .insert(defaultCategories)
    .select(CATEGORY_COLUMNS)
    .order("created_at", { ascending: true });

  if (error) {
    // Periksa apakah proses lain sudah membuat kategori.
    const categoriesAfterError = await getCategories();

    if (categoriesAfterError.length > 0) {
      return categoriesAfterError;
    }

    throw error;
  }

  return data ?? [];
}
