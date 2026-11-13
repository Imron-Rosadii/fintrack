import { AlertTriangle, X } from "lucide-react";
import Button from "../atoms/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  isOpen,
  title = "Delete Transaction?",
  message = "This transaction will be permanently deleted. This action cannot be undone.",
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl sm:p-6 dark:border-gray-700 dark:bg-gray-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex size-12 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            aria-label="Close confirmation"
            className="p-2 text-gray-400"
          >
            <X size={20} />
          </Button>
        </div>

        <h3 className="mt-5 wrap-break-word text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-2 wrap-break-word text-sm leading-6 text-gray-500 dark:text-gray-400">
          {message}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
