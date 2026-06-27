// app/dashboard/admin/page.js
"use client";

import { useState, useEffect } from "react";
import { Person, LayoutCellsLarge, FolderOpen, CircleDollar } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { getAdminStats } from "@/lib/api/admin";

const STAT_CARDS = [
  { label: "Total Users", key: "totalUsers", icon: Person, color: "#3B5BDB" },
  { label: "Total Products", key: "totalProducts", icon: LayoutCellsLarge, color: "#F97316" },
  { label: "Total Orders", key: "totalOrders", icon: FolderOpen, color: "#CA8A04" },
  { label: "Total Revenue", key: "totalRevenue", icon: CircleDollar, color: "#16A34A", isMoney: true },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        toast.error("Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>
        Welcome, Admin
      </h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Here&apos;s a snapshot of your platform.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, key, icon: Icon, color, isMoney }) => (
          <div
            key={key}
            className="flex items-center gap-4 rounded-2xl border p-5 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
          >
            {/* Icon bubble */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}1A` }}
            >
              <Icon width={22} height={22} style={{ color }} />
            </div>

            {/* Value + label */}
            <div className="flex flex-col">
              <span className="text-sm" style={{ color: "#78716C" }}>{label}</span>
              <span className="text-xl font-bold" style={{ color: "#1C1917" }}>
                {isLoading
                  ? "..."
                  : isMoney
                  ? `$${(stats?.[key] ?? 0).toLocaleString()}`
                  : (stats?.[key] ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}