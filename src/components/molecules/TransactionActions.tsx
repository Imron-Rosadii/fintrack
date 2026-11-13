import { Pencil, Trash2 } from "lucide-react";
import Button from "../atoms/Button";

interface TransactionActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

function TransactionActions({ onEdit, onDelete }: TransactionActionsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        aria-label="Edit transaction"
        title="Edit transaction"
        className="size-8 p-0 text-gray-500 hover:bg-green-50 hover:text-green-600 dark:text-gray-400 dark:hover:bg-green-950/60 dark:hover:text-green-400"
      >
        <Pencil size={15} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        aria-label="Delete transaction"
        title="Delete transaction"
        className="size-8 p-0 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/60 dark:hover:text-red-400"
      >
        <Trash2 size={15} />
      </Button>
    </div>
  );
}

export default TransactionActions;
