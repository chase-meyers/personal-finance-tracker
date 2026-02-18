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
    <div style={{ padding: "32px" }}>
      <h1 style={{ color: "#0F172A" }}>Dashboard</h1>
      <div
        style={{
          marginTop: "16px",
          background: "#FFFFFF",
          padding: "16px",
          borderRadius: "12px",
          border: `1px solid ${isPositive ? "#86EFAC" : "#FCA5A5"}`,
        }}
      >
        <div style={{ color: "#64748B", fontSize: "0.9rem" }}>Monthly Net Income</div>
        <div
          style={{
            marginTop: "4px",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: isPositive ? "#15803D" : "#B91C1C",
          }}
        >
          ${netIncome.toFixed(2)}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
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
