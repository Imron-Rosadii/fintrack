import { useContext } from "react";
import { TransactionContext } from "../context/transaction-context";

function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider",
    );
  }

  return context;
}

export default useTransactions;
