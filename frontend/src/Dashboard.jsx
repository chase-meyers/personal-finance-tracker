import { useMemo } from "react";
import SpendingChart from "./SpendingChart";
import IncomeChart from "./IncomeChart";
import RecentTransactions from "./RecentTransactions";
import { useFinanceStore } from "./store/useFinanceStore";

export default function Dashboard() {
  const recurringIncome = useFinanceStore((state) => state.recurringIncome);
  const totalMonthlySpending = useFinanceStore((state) => state.totalMonthlySpending);
  const netIncome = useMemo(() => {
    const totalMonthlyIncome = (Array.isArray(recurringIncome) ? recurringIncome : []).reduce(
      (total, item) => total + Number(item?.amount || 0),
      0
    );
    return totalMonthlyIncome - Number(totalMonthlySpending || 0);
  }, [recurringIncome, totalMonthlySpending]);
  const isPositive = netIncome >= 0;

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#E2E8F0", margin: 0 }}>Dashboard</h1>
      <div
        style={{
          marginTop: "16px",
          background: "#1F2937",
          padding: "18px 20px",
          borderRadius: "14px",
          border: `1px solid ${isPositive ? "#34D39966" : "#F8717166"}`,
          boxShadow: "0 16px 32px rgba(2, 6, 23, 0.35)",
        }}
      >
        <div style={{ color: "#94A3B8", fontSize: "0.85rem", letterSpacing: "0.2px" }}>Monthly Net Income</div>
        <div
          style={{
            marginTop: "4px",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: isPositive ? "#34D399" : "#F87171",
          }}
        >
          ${netIncome.toFixed(2)}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        marginTop: "24px"
      }}>
        <SpendingChart />
        <IncomeChart />
      </div>

      <div style={{ marginTop: "32px" }}>
        <RecentTransactions showAddTransaction={false} />
      </div>
    </div>
  );
}
