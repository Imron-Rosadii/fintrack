import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

function Select({ error, className = "", children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      <select
        {...props}
        aria-invalid={Boolean(error)}
        className={`
          w-full rounded-lg border bg-white px-3 py-2 text-sm
          text-gray-900 outline-none transition
          focus:border-green-500 focus:ring-2 focus:ring-green-500/20
          disabled:cursor-not-allowed disabled:bg-gray-100
          dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900
          ${error ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
          ${className}
        `}
      >
        {children}
      </select>

      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
