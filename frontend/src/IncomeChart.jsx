import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function IncomeChart() {
  const data = [
    { name: "Job", value: 1200 },
    { name: "Freelance", value: 600 },
    { name: "Investments", value: 300 }
  ];

  const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD"];

  return (
    <div style={{
      background: "#FFFFFF",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0"
    }}>
      <h3 style={{ marginBottom: "16px", color: "#0F172A" }}>Income Breakdown</h3>
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