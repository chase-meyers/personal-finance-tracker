import { useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTransactionStore } from "./store/useTransactionStore";

export default function SpendingChart() {
  const transactions = useTransactionStore((state) => state.transactions);

  useEffect(() => {
    useTransactionStore.getState().fetchTransactions();
  }, []);

  const data = useMemo(() => {
    const monthlyTotals = (Array.isArray(transactions) ? transactions : []).reduce(
      (totals, transaction) => {
        const parsed = new Date(transaction?.date);
        if (Number.isNaN(parsed.getTime())) {
          return totals;
        }

        const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
        totals[key] = (totals[key] || 0) + Number(transaction?.amount || 0);
        return totals;
      },
      {}
    );

    return Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, amount]) => {
        const [year, month] = key.split("-");
        return {
          month: new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          amount,
        };
      });
  }, [transactions]);

  const categoryTotals = useMemo(() => {
    return (Array.isArray(transactions) ? transactions : []).reduce((totals, transaction) => {
      const category = transaction?.category || "Other";
      totals[category] = (totals[category] || 0) + Number(transaction?.amount || 0);
      return totals;
    }, {});
  }, [transactions]);

  return (
    <div style={{
      background: "#FFFFFF",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0"
    }}>
      <h3 style={{ marginBottom: "16px", color: "#0F172A" }}>Monthly Spending</h3>
      {data.length === 0 && <p style={{ color: "#64748B" }}>No spending data yet.</p>}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: "12px", color: "#334155", fontSize: "0.9rem" }}>
        {Object.entries(categoryTotals).map(([category, amount]) => (
          <div key={category}>
            {category}: ${Number(amount).toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}
