import { Link } from "react-router-dom";

export default function TopNav() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 32px",
      background: "rgba(15, 23, 42, 0.85)",
      borderBottom: "1px solid #334155",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <h2 style={{ margin: 0, color: "#E2E8F0", letterSpacing: "0.2px" }}>Finance Tracker</h2>
      <div style={{ display: "flex", gap: "24px" }}>
        <Link to="/" style={{ color: "#CBD5E1", textDecoration: "none", fontWeight: 500 }}>Dashboard</Link>
        <Link to="/transactions" style={{ color: "#CBD5E1", textDecoration: "none", fontWeight: 500 }}>Transactions</Link>
        <Link to="/income" style={{ color: "#CBD5E1", textDecoration: "none", fontWeight: 500 }}>Income</Link>
      </div>
    </nav>
  );
}
