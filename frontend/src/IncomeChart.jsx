import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useFinanceStore } from "./store/useFinanceStore";

export default function IncomeChart() {
  const recurringIncome = useFinanceStore((state) => state.recurringIncome);

  const data = useMemo(() => {
    const totalsByCategory = (Array.isArray(recurringIncome) ? recurringIncome : []).reduce(
      (totals, item) => {
        const category = item?.category || "Other";
        totals[category] = (totals[category] || 0) + Number(item?.amount || 0);
        return totals;
      },
      {}
    );

    return Object.entries(totalsByCategory).map(([name, value]) => ({ name, value }));
  }, [recurringIncome]);

  const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD"];

  return (
    <div style={{
      background: "#1F2937",
      padding: "24px",
      borderRadius: "14px",
      border: "1px solid #334155",
      boxShadow: "0 16px 32px rgba(2, 6, 23, 0.35)",
    }}>
      <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#E2E8F0" }}>Income Breakdown</h3>
      {data.length === 0 && <p style={{ color: "#94A3B8" }}>No recurring income yet.</p>}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80} fill="#3B82F6" label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "10px" }} labelStyle={{ color: "#CBD5E1" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
