import { z } from "zod";

export const transactionSchema = z.object({
  title: z.string().min(1, "Nama transaksi wajib diisi"),
  amount: z
    .number({ error: "Nominal harus berupa angka" })
    .positive("Nominal harus lebih dari 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Kategori wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib diisi"),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
