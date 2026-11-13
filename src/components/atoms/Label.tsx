import type { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

function Label({
  required = false,
  children,
  className = "",
  ...props
}: LabelProps) {
  return (
    <label
      {...props}
      className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}

      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export default Label;
