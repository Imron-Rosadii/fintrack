import SearchInput from "../molecules/SearchInput";
import FilterSelect from "../molecules/FilterSelect";

import type { TransactionType } from "../../types/transaction";

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: "all" | TransactionType;
  onTypeChange: (value: "all" | TransactionType) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

function TransactionFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  categories,
}: TransactionFiltersProps) {
  const categoryOptions = [
    { label: "All Categories", value: "all" },
    ...categories.map((category) => ({
      label: category,
      value: category,
    })),
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <SearchInput value={searchTerm} onChange={onSearchChange} />

      <FilterSelect
        value={typeFilter}
        onChange={(value) => onTypeChange(value as "all" | TransactionType)}
        ariaLabel="Filter by transaction type"
        options={[
          { label: "All Types", value: "all" },
          { label: "Income", value: "income" },
          { label: "Expense", value: "expense" },
        ]}
      />

      <FilterSelect
        value={categoryFilter}
        onChange={onCategoryChange}
        ariaLabel="Filter by category"
        options={categoryOptions}
      />
    </div>
  );
}

export default TransactionFilters;
