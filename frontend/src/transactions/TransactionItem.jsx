export default function TransactionItem({ transaction, categories, onChangeCategory, onDelete }) {
  return (
    <div
      style={{
        padding: "14px 12px",
        borderBottom: "1px solid #334155",
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
        alignItems: "center",
        borderRadius: "10px",
      }}
    >
      <div>
        <strong style={{ color: "#E2E8F0" }}>{transaction.category}</strong>{" "}
        <span style={{ color: "#93C5FD" }}>${Number(transaction.amount).toFixed(2)}</span>
        <div style={{ color: "#94A3B8", fontSize: "0.9rem" }}>
          {transaction.date}
          {transaction.description ? ` - ${transaction.description}` : ""}
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <select
          value={transaction.category || "Other"}
          onChange={(event) => onChangeCategory(transaction.id, event.target.value)}
          style={{ padding: "8px", borderRadius: "8px", border: "1px solid #334155", background: "#0F172A", color: "#E2E8F0" }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          style={{
            padding: "8px 10px",
            borderRadius: "8px",
            border: "1px solid #7F1D1D",
            background: "#3F1D24",
            color: "#FCA5A5",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
