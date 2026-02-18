import { useMemo, useState } from "react";

const formCardStyle = {
  background: "#1F2937",
  padding: "24px",
  borderRadius: "14px",
  border: "1px solid #334155",
  marginBottom: "16px",
  boxShadow: "0 16px 32px rgba(2, 6, 23, 0.35)",
};

export default function TransactionForm({ categories, onSubmit, onAddCategory }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(categories[0] || "Other");
  const [customCategory, setCustomCategory] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedCategories = useMemo(
    () => (Array.isArray(categories) && categories.length > 0 ? categories : ["Other"]),
    [categories]
  );

  const handleAddCategory = () => {
    const value = customCategory.trim();
    if (!value) {
      return;
    }
    onAddCategory(value);
    setCategory(value);
    setCustomCategory("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        amount,
        description,
        date,
        category,
      });
      setAmount("");
      setDescription("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not add transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={formCardStyle}>
      <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#E2E8F0" }}>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0F172A", color: "#E2E8F0" }}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0F172A", color: "#E2E8F0" }}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0F172A",
            color: "#E2E8F0",
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginTop: "12px" }}>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0F172A", color: "#E2E8F0" }}
          >
            {normalizedCategories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#2563EB",
              color: "#F8FAFC",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {isSubmitting ? "Saving..." : "Add"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", marginTop: "12px" }}>
          <input
            type="text"
            value={customCategory}
            onChange={(event) => setCustomCategory(event.target.value)}
            placeholder="Create category"
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0F172A", color: "#E2E8F0" }}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#111827",
              color: "#CBD5E1",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Add Category
          </button>
        </div>
      </form>
      {error && <p style={{ marginBottom: 0, color: "#F87171" }}>{error}</p>}
    </div>
  );
}
