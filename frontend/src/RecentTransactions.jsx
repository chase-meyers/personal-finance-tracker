import { useEffect, useState } from "react";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data.transactions));
  }, []);

  return (
    <div style={{
      background: "#FFFFFF",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0"
    }}>
      <h3 style={{ marginBottom: "16px", color: "#0F172A" }}>Recent Transactions</h3>

      {transactions.map(t => (
        <div key={t.id} style={{
          padding: "12px 0",
          borderBottom: "1px solid #E2E8F0"
        }}>
          <strong>{t.category}</strong> — ${t.amount}
          <div style={{ color: "#64748B", fontSize: "0.9rem" }}>
            {t.date} • {t.description}
          </div>
        </div>
      ))}
    </div>
  );
}