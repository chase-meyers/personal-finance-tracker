import { useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTransactionStore } from "./store/useTransactionStore";
import { useFinanceStore } from "./store/useFinanceStore";

const parseYearMonthDay = (value) => {
  if (typeof value === "string") {
    const dateMatch = value.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
    if (dateMatch) {
      return {
        year: Number(dateMatch[1]),
        month: Number(dateMatch[2]),
        day: dateMatch[3] ? Number(dateMatch[3]) : null,
      };
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth() + 1,
    day: parsed.getDate(),
  };
};

const resolveSelectedYearMonth = (selectedMonth, selectedDate) => {
  const fromMonth = parseYearMonthDay(selectedMonth);
  if (fromMonth) {
    return { year: fromMonth.year, month: fromMonth.month };
  }

  const fromDate = parseYearMonthDay(selectedDate);
  if (fromDate) {
    return { year: fromDate.year, month: fromDate.month };
  }

  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

export default function SpendingChart() {
  const transactions = useTransactionStore((state) => state.transactions);
  const selectedDate = useFinanceStore((state) => state.selectedDate);
  const selectedMonth = useFinanceStore((state) => state.selectedMonth);

  useEffect(() => {
    useTransactionStore.getState().fetchTransactions();
  }, []);

  const activeYearMonth = useMemo(
    () => resolveSelectedYearMonth(selectedMonth, selectedDate),
    [selectedMonth, selectedDate]
  );

  const filteredTransactions = useMemo(() => {
    return (Array.isArray(transactions) ? transactions : []).filter((transaction) => {
      const parts = parseYearMonthDay(transaction?.date);
      if (!parts) {
        return false;
      }
      return (
        parts.year === activeYearMonth.year &&
        parts.month === activeYearMonth.month
      );
    });
  }, [transactions, activeYearMonth]);

  const data = useMemo(() => {
    const dailyTotals = filteredTransactions.reduce(
      (totals, transaction) => {
        const parts = parseYearMonthDay(transaction?.date);
        if (!parts || !parts.day) {
          return totals;
        }

        const key = String(parts.day).padStart(2, "0");
        totals[key] = (totals[key] || 0) + Number(transaction?.amount || 0);
        return totals;
      },
      {}
    );

    return Object.entries(dailyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, amount]) => ({
        month: day,
        amount,
      }));
  }, [filteredTransactions]);

  const categoryTotals = useMemo(() => {
    return filteredTransactions.reduce((totals, transaction) => {
      const category = transaction?.category || "Other";
      totals[category] = (totals[category] || 0) + Number(transaction?.amount || 0);
      return totals;
    }, {});
  }, [filteredTransactions]);

  return (
    <div style={{
      background: "#1F2937",
      padding: "24px",
      borderRadius: "14px",
      border: "1px solid #334155",
      boxShadow: "0 16px 32px rgba(2, 6, 23, 0.35)",
    }}>
      <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#E2E8F0" }}>
        Monthly Spending ({activeYearMonth.year}-{String(activeYearMonth.month).padStart(2, "0")})
      </h3>
      {data.length === 0 && <p style={{ color: "#94A3B8" }}>No spending data yet.</p>}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" tick={{ fill: "#94A3B8" }} axisLine={{ stroke: "#334155" }} tickLine={{ stroke: "#334155" }} />
          <YAxis tick={{ fill: "#94A3B8" }} axisLine={{ stroke: "#334155" }} tickLine={{ stroke: "#334155" }} />
          <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "10px" }} labelStyle={{ color: "#CBD5E1" }} />
          <Line type="monotone" dataKey="amount" stroke="#60A5FA" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: "12px", color: "#CBD5E1", fontSize: "0.9rem" }}>
        {Object.entries(categoryTotals).map(([category, amount]) => (
          <div key={category}>
            {category}: ${Number(amount).toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}
