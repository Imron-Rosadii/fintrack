interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  ariaLabel?: string;
}

function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
      className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 outline-none transition focus:border-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default FilterSelect;
