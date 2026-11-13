import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Transaction } from "../types/transaction";

interface ExportTransactionsPdfProps {
  transactions: Transaction[];
  monthFilter: string;
  income: number;
  expense: number;
  balance: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPeriod = (month: string) => {
  if (!month) return "Semua Periode";

  const [year, monthNumber] = month.split("-").map(Number);

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthNumber - 1, 1));
};

export function exportTransactionsPdf({
  transactions,
  monthFilter,
  income,
  expense,
  balance,
}: ExportTransactionsPdfProps) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("FINTRACK", 14, 20);

  doc.setFontSize(11);
  doc.text("Laporan Transaksi Keuangan", 14, 28);

  doc.setFontSize(10);
  doc.text(`Periode: ${formatPeriod(monthFilter)}`, 14, 36);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 42);

  autoTable(doc, {
    startY: 50,
    head: [["Ringkasan", "Jumlah"]],
    body: [
      ["Total Pemasukan", formatCurrency(income)],
      ["Total Pengeluaran", formatCurrency(expense)],
      ["Saldo Bersih", formatCurrency(balance)],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [22, 163, 74],
    },
    styles: {
      fontSize: 9,
    },
  });

  const summaryEndY = (doc as jsPDF & { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  autoTable(doc, {
    startY: summaryEndY + 10,
    head: [["Tanggal", "Nama Transaksi", "Kategori", "Jenis", "Nominal"]],
    body: transactions.map((transaction) => [
      transaction.date,
      transaction.title,
      transaction.category,
      transaction.type === "income" ? "Pemasukan" : "Pengeluaran",
      formatCurrency(transaction.amount),
    ]),
    theme: "striped",
    headStyles: {
      fillColor: [22, 163, 74],
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      4: {
        halign: "right",
      },
    },
  });

  const filename = monthFilter
    ? `FinTrack-Laporan-${monthFilter}.pdf`
    : "FinTrack-Laporan-Semua-Periode.pdf";

  doc.save(filename);
}
