import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SpendingChart() {
  const data = [
    { month: "Jan", amount: 400 },
    { month: "Feb", amount: 320 },
    { month: "Mar", amount: 500 }
  ];

  return (
    <div style={{
      background: "#FFFFFF",
      padding: "24px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0"
    }}>
      <h3 style={{ marginBottom: "16px", color: "#0F172A" }}>Monthly Spending</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}