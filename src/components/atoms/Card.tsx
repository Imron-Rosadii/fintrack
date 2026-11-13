import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border border-slate-200
      bg-white p-4 shadow-sm sm:p-6
        dark:border-gray-800
        dark:bg-gray-900
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
