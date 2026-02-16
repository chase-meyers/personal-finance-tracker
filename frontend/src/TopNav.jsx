import { Link } from "react-router-dom";

export default function TopNav() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 32px",
      background: "#FFFFFF",
      borderBottom: "1px solid #E2E8F0"
    }}>
      <h2 style={{ margin: 0, color: "#0F172A" }}>Finance Tracker</h2>
      <div style={{ display: "flex", gap: "24px" }}>
        <Link to="/" style={{ color: "#0F172A", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/transactions" style={{ color: "#0F172A", textDecoration: "none" }}>Transactions</Link>
        <Link to="/income" style={{ color: "#0F172A", textDecoration: "none" }}>Income</Link>
      </div>
    </nav>
  );
}