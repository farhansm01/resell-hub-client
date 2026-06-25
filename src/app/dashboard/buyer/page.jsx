"use client";

import { useState, useEffect } from "react";
import { Card } from "@heroui/react";
import { Box, Star, ChartLine } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getBuyerOrders } from "@/lib/api/orders";
import { getWishlist } from "@/lib/api/wishlist";

export default function BuyerOverviewPage() {
  const { data: session, isPending } = useSession();
  const buyerId = session?.user?.id;
  const name = session?.user?.name || "there";

  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPending || !buyerId) return;

    const fetchData = async () => {
      try {
        const [ordersData, wishlistData] = await Promise.all([
          getBuyerOrders(buyerId),
          getWishlist(buyerId),
        ]);
        setOrders(ordersData);
        setWishlistCount(wishlistData.length);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [buyerId, isPending]);

  // Orders placed in the last 30 days — distinct from lifetime total
  const recentPurchaseCount = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orderDate >= thirtyDaysAgo;
  }).length;

  const STATS = [
    { label: "Total Orders", value: orders.length, icon: Box, color: "#F97316" },
    { label: "Wishlist Count", value: wishlistCount, icon: Star, color: "#3B5BDB" },
    { label: "Recent Purchases", value: recentPurchaseCount, icon: ChartLine, color: "#16A34A" },
  ];

  const recentOrders = orders.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm" style={{ color: "#78716C" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Welcome back, {name}</h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Here&apos;s a look at your activity.
      </p>

      {/* Stat cards — HeroUI Card.Content, confirmed working pattern from Seller Overview */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border border-[#E7E5E4] shadow-sm">
            <Card.Content className="flex flex-row items-center gap-4 p-5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}1A` }}
              >
                <Icon width={22} height={22} style={{ color }} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm" style={{ color: "#78716C" }}>{label}</span>
                <span className="text-xl font-bold" style={{ color: "#1C1917" }}>{value}</span>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Recent purchases — last 3 orders, plain cards (no HeroUI, matches My Products precedent) */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold" style={{ color: "#1C1917" }}>Recent Purchases</h2>

        {recentOrders.length === 0 ? (
          <div
            className="mt-4 rounded-2xl p-8 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
          >
            <p className="text-sm" style={{ color: "#78716C" }}>No purchases yet.</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl p-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
              >
                <p className="font-medium truncate" style={{ color: "#1C1917" }}>
                  {order.productName}
                </p>
                <p className="text-sm mt-1" style={{ color: "#78716C" }}>
                  ${order.amount} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}