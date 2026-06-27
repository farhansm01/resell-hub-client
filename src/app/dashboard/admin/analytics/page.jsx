// app/dashboard/admin/analytics/page.js
"use client";

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ── Fake static data (as allowed by spec) ────────────────────────────

const USER_GROWTH = [
  { month: "Jan", users: 12 },
  { month: "Feb", users: 28 },
  { month: "Mar", users: 45 },
  { month: "Apr", users: 61 },
  { month: "May", users: 84 },
  { month: "Jun", users: 110 },
];

const CATEGORY_PERFORMANCE = [
  { category: "Electronics", products: 48 },
  { category: "Furniture", products: 31 },
  { category: "Vehicles", products: 19 },
  { category: "Fashion", products: 55 },
  { category: "Mobile Phones", products: 42 },
];

const MONTHLY_ORDERS = [
  { month: "Jan", orders: 18 },
  { month: "Feb", orders: 34 },
  { month: "Mar", orders: 27 },
  { month: "Apr", orders: 52 },
  { month: "May", orders: 63 },
  { month: "Jun", orders: 79 },
];

const TOP_CATEGORIES_REVENUE = [
  { name: "Electronics",   value: 42000 },
  { name: "Mobile Phones", value: 31000 },
  { name: "Vehicles",      value: 27000 },
  { name: "Fashion",       value: 18000 },
  { name: "Furniture",     value: 12000 },
];

const PIE_COLORS = ["#F97316", "#3B5BDB", "#16A34A", "#CA8A04", "#DC2626"];

// ── Shared card wrapper ───────────────────────────────────────────────
function ChartCard({ title, children }) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
    >
      <h2 className="text-sm font-semibold mb-5" style={{ color: "#1C1917" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>
        Platform Analytics
      </h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Overview of platform growth, orders, and category performance.
      </p>

      {/* Row 1 — User Growth + Category Performance */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Chart 1 — User Growth (Line) */}
        <ChartCard title="User Growth — Last 6 Months">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={USER_GROWTH} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#78716C" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#78716C" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E7E5E4",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#F97316"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#F97316" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2 — Category Performance (Bar) */}
        <ChartCard title="Category Performance — Products Listed">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={CATEGORY_PERFORMANCE} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 10, fill: "#78716C" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#78716C" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E7E5E4",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="products" fill="#3B5BDB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2 — Monthly Orders + Top Categories Revenue */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Chart 3 — Monthly Orders (Bar) */}
        <ChartCard title="Monthly Orders — Last 6 Months">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_ORDERS} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#78716C" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#78716C" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E7E5E4",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="orders" fill="#F97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4 — Top Categories by Revenue (Pie) */}
        <ChartCard title="Top Categories by Revenue">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={TOP_CATEGORIES_REVENUE}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {TOP_CATEGORIES_REVENUE.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E7E5E4",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: "#78716C" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}