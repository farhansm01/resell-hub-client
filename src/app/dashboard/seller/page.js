"use client";

import { useState, useEffect } from "react";
import { Box, ChartLine, CircleDollar, Clock } from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";
import { getMyProducts } from "@/lib/api/products";
import { getSellerOrders } from "@/lib/api/orders";
import { toast } from "react-toastify";

export default function DashboardOverviewPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPending || !user?.id) return;
    const fetchStats = async () => {
      try {
        const [productsData, orders] = await Promise.all([
          getMyProducts(user.id),
          getSellerOrders(user.id),
        ]);

        const totalProducts = productsData.products?.length ?? 0;
        const totalSales = orders.filter(o => o.orderStatus !== "cancelled").length;
        const revenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const pendingOrders = orders.filter(o => o.orderStatus === "pending").length;

        setStats({ totalProducts, totalSales, revenue, pendingOrders });
      } catch (err) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id, isPending]);

  const STAT_CARDS = [
    { label: "Total Products", value: stats.totalProducts, icon: Box, color: "#f1b055" },
    { label: "Total Sales", value: stats.totalSales, icon: ChartLine, color: "#f1b055" },
    { label: "Revenue", value: `৳${stats.revenue.toLocaleString()}`, icon: CircleDollar, color: "#f1b055" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "#f1b055" },
  ];

  const name = user?.name || "there";

  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "#18020c" }}>Welcome back, {name}</h1>
      <p className="mt-1 text-sm" style={{ color: "#7a6c5d" }}>
        Here&apos;s a quick look at how your store is doing.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border bg-white p-5 flex items-center gap-4 shadow-xs"
            style={{ borderColor: "rgba(122, 108, 93, 0.25)" }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: "rgba(241, 176, 85, 0.15)" }}
            >
              <Icon width={22} height={22} style={{ color }} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm" style={{ color: "#7a6c5d" }}>{label}</span>
              <span className="text-xl font-bold" style={{ color: "#18020c" }}>
                {isLoading ? "..." : value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
