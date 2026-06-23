"use client";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// HeroUI
import { Card } from "@heroui/react";

// Gravity UI Icons
import {
  ChartColumn,
  TriangleUp,
  Box,
} from "@gravity-ui/icons";

export default function SellerAnalyticsPage() {
  // =========================
  // Sales Overview Data
  // =========================
  const salesData = [
    { month: "Jan", sales: 12 },
    { month: "Feb", sales: 19 },
    { month: "Mar", sales: 8 },
    { month: "Apr", sales: 24 },
    { month: "May", sales: 17 },
    { month: "Jun", sales: 30 },
  ];

  // =========================
  // Revenue Trend Data
  // =========================
  const revenueData = [
    { month: "Jan", revenue: 18000 },
    { month: "Feb", revenue: 32000 },
    { month: "Mar", revenue: 15000 },
    { month: "Apr", revenue: 45000 },
    { month: "May", revenue: 37000 },
    { month: "Jun", revenue: 58000 },
  ];

  // =========================
  // Top Products Data
  // =========================
  const topProducts = [
    { product: "iPhone 15 Pro", sold: 85 },
    { product: "Samsung S24", sold: 72 },
    { product: "MacBook Air M3", sold: 60 },
    { product: "AirPods Pro", sold: 54 },
    { product: "iPad Air", sold: 42 },
  ];

  return (
    <section
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: "#FAFAF9" }}
    >
      {/* =========================
          Page Heading
      ========================= */}
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "#1C1917" }}
        >
          Sales Analytics
        </h1>

        <p
          className="mt-2 text-sm"
          style={{ color: "#78716C" }}
        >
          Track sales performance, revenue growth, and top-selling products.
        </p>
      </div>

      {/* =========================
          Top Grid
      ========================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* =========================
            Sales Overview
        ========================= */}
        <Card radius="md" className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <ChartColumn
              className="size-5"
              style={{ color: "#F97316" }}
            />

            <h2
              className="font-semibold text-lg"
              style={{ color: "#1C1917" }}
            >
              Sales Overview
            </h2>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="sales"
                  fill="#F97316"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* =========================
            Revenue Trend
        ========================= */}
        <Card radius="md" className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <TriangleUp
              className="size-5"
              style={{ color: "#3B5BDB" }}
            />

            <h2
              className="font-semibold text-lg"
              style={{ color: "#1C1917" }}
            >
              Monthly Revenue Trend
            </h2>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B5BDB"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* =========================
          Top Selling Products
      ========================= */}
      <Card radius="md" className="p-5 mt-6">
        <div className="flex items-center gap-2 mb-5">
          <Box
            className="size-5"
            style={{ color: "#C2410C" }}
          />

          <h2
            className="font-semibold text-lg"
            style={{ color: "#1C1917" }}
          >
            Top Selling Products
          </h2>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="vertical"
              margin={{
                top: 10,
                right: 20,
                left: 40,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis
                dataKey="product"
                type="category"
                width={120}
              />

              <Tooltip />

              <Bar
                dataKey="sold"
                fill="#C2410C"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
}