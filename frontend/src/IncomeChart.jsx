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
      background: "#FFFFFF",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0"
    }}>
      <h3 style={{ marginBottom: "16px", color: "#0F172A" }}>Income Breakdown</h3>
      {data.length === 0 && <p style={{ color: "#64748B" }}>No recurring income yet.</p>}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80} fill="#3B82F6" label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
