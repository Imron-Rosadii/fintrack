import { supabase } from "../lib/supabase";
import type { TransactionType } from "../types/transaction";

export interface TransactionRecord {
  id: string;
  category_id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export type TransactionInput = Omit<TransactionRecord, "id">;

const TRANSACTION_COLUMNS = "id, category_id, title, amount, type, date";

// Mengambil seluruh transaksi milik pengguna yang login.
export async function getTransactions(): Promise<TransactionRecord[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select(TRANSACTION_COLUMNS)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as TransactionRecord[];
}

// Menambahkan transaksi.
export async function createTransaction(
  transaction: TransactionInput,
): Promise<TransactionRecord> {
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select(TRANSACTION_COLUMNS)
    .single();

  if (error) throw error;

  return data as TransactionRecord;
}

// Mengubah transaksi.
export async function updateTransaction(
  id: string,
  transaction: Partial<TransactionInput>,
): Promise<TransactionRecord> {
  const { data, error } = await supabase
    .from("transactions")
    .update(transaction)
    .eq("id", id)
    .select(TRANSACTION_COLUMNS)
    .single();

  if (error) throw error;

  return data as TransactionRecord;
}

// Menghapus transaksi.
export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw error;
}
