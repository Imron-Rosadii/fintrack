import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import FormField from "../molecules/FormField";

import {
  transactionSchema,
  type TransactionFormValues,
} from "../../schemas/transactionSchema";

import type { Transaction } from "../../types/transaction";

import CategoryBadge from "../molecules/CategoryBadge";

import useTransactions from "../../hooks/useTransactions";

import { DEFAULT_CATEGORY_APPEARANCE } from "../../constants/categoryAppearance";

interface TransactionFormProps {
  initialData?: Transaction | null;
  categories: string[];
  onSubmit: (data: TransactionFormValues) => Promise<boolean> | void;
  onCancel: () => void;
}

const defaultValues: TransactionFormValues = {
  title: "",
  amount: 0,
  type: "expense",
  category: "",
  date: new Date().toISOString().split("T")[0],
};

const formatAmount = (value: number) => {
  if (!value) return "";

  return new Intl.NumberFormat("id-ID").format(value);
};

function TransactionForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const { categoryAppearances } = useTransactions();

  const selectedCategory = useWatch({
    control,
    name: "category",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        amount: initialData.amount,
        type: initialData.type,
        category: initialData.category,
        date: initialData.date,
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const submitHandler = async (data: TransactionFormValues) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <FormField
        label="Transaction Name"
        htmlFor="title"
        required
        error={errors.title?.message}
      >
        <Input
          id="title"
          placeholder="Contoh: Gaji bulanan"
          {...register("title")}
          error={errors.title?.message}
        />
      </FormField>

      <FormField
        label="Amount"
        htmlFor="amount"
        required
        error={errors.amount?.message}
      >
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              id="amount"
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 5.000.000"
              value={formatAmount(field.value)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");

                field.onChange(Number(rawValue) || 0);
              }}
              error={errors.amount?.message}
            />
          )}
        />
      </FormField>

      <FormField
        label="Transaction Type"
        htmlFor="type"
        required
        error={errors.type?.message}
      >
        <Select id="type" {...register("type")}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
      </FormField>

      <FormField
        label="Category"
        htmlFor="category"
        required
        error={errors.category?.message}
      >
        <div className="space-y-3">
          <Select id="category" {...register("category")}>
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          {selectedCategory && (
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Selected Category
              </p>

              <CategoryBadge
                name={selectedCategory}
                appearance={
                  categoryAppearances[selectedCategory] ??
                  DEFAULT_CATEGORY_APPEARANCE
                }
                size="sm"
              />
            </div>
          )}
        </div>
      </FormField>

      <FormField
        label="Date"
        htmlFor="date"
        required
        error={errors.date?.message}
      >
        <Input
          id="date"
          type="date"
          {...register("date")}
          error={errors.date?.message}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {initialData ? "Update Transaction" : "Save Transaction"}
        </Button>
      </div>
    </form>
  );
}

export default TransactionForm;
