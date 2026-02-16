import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CATEGORY_COLORS = {
  Salary: "#22C55E",
  Freelance: "#3B82F6",
  Investments: "#F97316",
  Other: "#A855F7",
};

const DEFAULT_INCOME = [
  { id: 1, name: "Job", amount: 2500, category: "Salary" },
  { id: 2, name: "Freelance Retainer", amount: 600, category: "Freelance" },
  { id: 3, name: "Dividends", amount: 120, category: "Investments" },
];

export default function Income() {
  const [recurringIncome, setRecurringIncome] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "Salary",
  });

  useEffect(() => {
    setRecurringIncome(DEFAULT_INCOME);
  }, []);

  const totalThisMonth = useMemo(
    () =>
      recurringIncome.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      ),
    [recurringIncome]
  );

  const categoryBreakdown = useMemo(() => {
    const map = {};
    recurringIncome.forEach((item) => {
      const key = item.category || "Other";
      map[key] = (map[key] || 0) + Number(item.amount || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [recurringIncome]);

  const startAdd = () => {
    setEditingId(null);
    setForm({ name: "", amount: "", category: "Salary" });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      amount: item.amount,
      category: item.category,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;

    if (editingId) {
      setRecurringIncome((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        name: form.name,
        amount: Number(form.amount),
        category: form.category,
      };
      setRecurringIncome((prev) => [...prev, newItem]);
    }

    setEditingId(null);
    setForm({ name: "", amount: "", category: "Salary" });
  };

  const handleDelete = (id) => {
    setRecurringIncome((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: "", amount: "", category: "Salary" });
    }
  };

  return (
    <div style={{ padding: "32px" }}>
      <h1 style={{ color: "#0F172A", marginBottom: "8px" }}>Income</h1>
      <p style={{ color: "#64748B", marginBottom: "24px" }}>
        Monthly recurring income, auto‑applied every month. No re‑entry.
      </p>

      {/* Top summary + chart */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.8fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* Summary card */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #22C55E 0%, #16A34A 40%, #0F766E 100%)",
            borderRadius: "16px",
            padding: "20px",
            color: "white",
            boxShadow: "0 18px 40px rgba(15, 118, 110, 0.35)",
          }}
        >
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
            Income this month
          </div>
          <div style={{ fontSize: "2.4rem", fontWeight: 700, marginTop: "4px" }}>
            ${totalThisMonth.toLocaleString()}
          </div>
          <div style={{ marginTop: "12px", fontSize: "0.85rem", opacity: 0.9 }}>
            Based on your recurring monthly income sources.
          </div>
        </div>

        {/* Category breakdown chart */}
        <div
          style={{
            background: "#0F172A",
            borderRadius: "16px",
            padding: "16px 20px",
            color: "white",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.55)",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Monthly income breakdown</span>
          </div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {categoryBreakdown.map((entry, index) => {
                    const color =
                      CATEGORY_COLORS[entry.name] ||
                      Object.values(CATEGORY_COLORS)[
                        index % Object.values(CATEGORY_COLORS).length
                      ];
                    return <Cell key={entry.name} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid #1E293B",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                  }}
                  itemStyle={{ color: "white" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "0.75rem" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recurring income + form */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1.2fr",
          gap: "24px",
        }}
      >
        {/* Recurring list */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, color: "#0F172A" }}>
              Recurring monthly income
            </h3>
          </div>

          {recurringIncome.length === 0 && (
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#F9FAFB",
                border: "1px dashed #CBD5E1",
                fontSize: "0.9rem",
                color: "#6B7280",
              }}
            >
              No recurring income yet. Add your salary, side income, and other
              monthly sources on the right.
            </div>
          )}

          {recurringIncome.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "14px 12px",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.98rem",
                    color: "#0F172A",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    display: "inline-block",
                    padding: "3px 8px",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: "white",
                    background:
                      CATEGORY_COLORS[item.category] || "#6B7280",
                  }}
                >
                  {item.category}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#0F172A",
                  }}
                >
                  ${Number(item.amount).toLocaleString()}
                </div>
                <div style={{ marginTop: "6px" }}>
                  <button
                    onClick={() => startEdit(item)}
                    style={{
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      borderRadius: "999px",
                      border: "1px solid #CBD5E1",
                      background: "#F3F4F6",
                      marginRight: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      borderRadius: "999px",
                      border: "1px solid #FCA5A5",
                      background: "#FEF2F2",
                      color: "#B91C1C",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add / edit form */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, color: "#0F172A" }}>
              {editingId ? "Edit recurring income" : "Add recurring income"}
            </h3>
            {!editingId && (
              <button
                onClick={startAdd}
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  border: "1px solid #E5E7EB",
                  background: "#F9FAFB",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Job, Dividends, Side Hustle"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Amount (monthly)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="e.g. 2500"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.9rem",
                  background: "white",
                }}
              >
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investments">Investments</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: "999px",
                border: "none",
                background:
                  "linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              {editingId ? "Save changes" : "Add recurring income"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}