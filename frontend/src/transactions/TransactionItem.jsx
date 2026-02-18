export default function TransactionItem({ transaction, categories, onChangeCategory }) {
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <div>
        <strong>{transaction.category}</strong> - ${Number(transaction.amount).toFixed(2)}
        <div style={{ color: "#64748B", fontSize: "0.9rem" }}>
          {transaction.date}
          {transaction.description ? ` - ${transaction.description}` : ""}
        </div>
      </div>
      <select
        value={transaction.category || "Other"}
        onChange={(event) => onChangeCategory(transaction.id, event.target.value)}
        style={{ padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
