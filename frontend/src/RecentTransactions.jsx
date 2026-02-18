import { useEffect } from "react";
import { useTransactionStore } from "./store/useTransactionStore";
import TransactionForm from "./transactions/TransactionForm";
import TransactionItem from "./transactions/TransactionItem";

export default function RecentTransactions() {
  const {
    transactions,
    categories,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    addCategory,
    updateTransactionCategory,
  } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleChangeCategory = async (id, category) => {
    try {
      await updateTransactionCategory(id, category);
    } catch (_error) {
      // Errors are surfaced through the store error state where applicable.
    }
  };

  return (
    <>
      <TransactionForm
        categories={categories}
        onSubmit={addTransaction}
        onAddCategory={addCategory}
      />
      <div
        style={{
          background: "#FFFFFF",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
        }}
      >
        <h3 style={{ marginBottom: "16px", color: "#0F172A" }}>Recent Transactions</h3>

        {isLoading && <p style={{ color: "#64748B" }}>Loading transactions...</p>}
        {error && <p style={{ color: "#B91C1C" }}>{error}</p>}
        {!isLoading && transactions.length === 0 && (
          <p style={{ color: "#64748B" }}>No transactions yet.</p>
        )}
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            categories={categories}
            onChangeCategory={handleChangeCategory}
          />
        ))}
      </div>
    </>
  );
}
