import SpendingChart from "./SpendingChart";
import IncomeChart from "./IncomeChart";
import RecentTransactions from "./RecentTransactions";

export default function Dashboard() {
  return (
    <div style={{ padding: "32px" }}>
      <h1 style={{ color: "#0F172A" }}>Dashboard</h1>

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
        <RecentTransactions />
      </div>
    </div>
  );
}