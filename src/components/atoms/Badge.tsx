interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "danger" | "warning";
}

const styles = {
  success:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  warning:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

function Badge({ children, variant = "success" }: BadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
