import { useEffect, useRef } from "react";
import { useTransactionStore } from "./store/useTransactionStore";
import TransactionForm from "./transactions/TransactionForm";
import TransactionItem from "./transactions/TransactionItem";

export default function RecentTransactions({ showAddTransaction = true }) {
  const {
    transactions,
    categories,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    addCategory,
    updateTransactionCategory,
    deleteTransaction,
  } = useTransactionStore();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;
    fetchTransactions();
  }, [fetchTransactions]);

  const handleChangeCategory = async (id, category) => {
    try {
      await updateTransactionCategory(id, category);
    } catch (_error) {
      // Errors are surfaced through the store error state where applicable.
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
    } catch (_error) {
      // Errors are surfaced through the store error state where applicable.
    }
  };

  return (
    <>
      {showAddTransaction ? (
        <TransactionForm
          categories={categories}
          onSubmit={addTransaction}
          onAddCategory={addCategory}
        />
      ) : null}
      <div
        style={{
          background: "#1F2937",
          padding: "24px",
          borderRadius: "14px",
          border: "1px solid #334155",
          boxShadow: "0 16px 32px rgba(2, 6, 23, 0.35)",
        }}
      >
        <h3 style={{ marginBottom: "16px", marginTop: 0, color: "#E2E8F0" }}>Recent Transactions</h3>

        {isLoading && <p style={{ color: "#94A3B8" }}>Loading transactions...</p>}
        {error && <p style={{ color: "#F87171" }}>{error}</p>}
        {!isLoading && transactions.length === 0 && (
          <p style={{ color: "#94A3B8" }}>No transactions yet.</p>
        )}
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            categories={categories}
            onChangeCategory={handleChangeCategory}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
}
