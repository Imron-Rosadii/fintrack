import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

function Input({ error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        {...props}
        aria-invalid={Boolean(error)}
        className={`
          w-full rounded-lg border bg-white px-3 py-2 text-sm
          text-gray-900 outline-none transition
          placeholder:text-gray-400
          focus:border-green-500 focus:ring-2 focus:ring-green-500/20
          disabled:cursor-not-allowed disabled:bg-gray-100
          dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900
          ${error ? "border-red-500" : "border-gray-200 dark:border-gray-700"}
          ${className}
        `}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
