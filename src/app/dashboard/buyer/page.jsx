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

  const recentPurchaseCount = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orderDate >= thirtyDaysAgo;
  }).length;

  const STATS = [
    { label: "Total Orders", value: orders.length, icon: Box, color: "#f1b055" },
    { label: "Wishlist Count", value: wishlistCount, icon: Star, color: "#f1b055" },
    { label: "Recent Purchases", value: recentPurchaseCount, icon: ChartLine, color: "#f1b055" },
  ];

  const recentOrders = orders.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm" style={{ color: "#7a6c5d" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "#18020c" }}>Welcome back, {name}</h1>
      <p className="mt-1 text-sm" style={{ color: "#7a6c5d" }}>
        Here&apos;s a look at your activity.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border shadow-xs" style={{ borderColor: "rgba(122, 108, 93, 0.25)", backgroundColor: "#ffffff" }}>
            <Card.Content className="flex flex-row items-center gap-4 p-5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(241, 176, 85, 0.15)" }}
              >
                <Icon width={22} height={22} style={{ color }} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm" style={{ color: "#7a6c5d" }}>{label}</span>
                <span className="text-xl font-bold" style={{ color: "#18020c" }}>{value}</span>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold" style={{ color: "#18020c" }}>Recent Purchases</h2>

        {recentOrders.length === 0 ? (
          <div
            className="mt-4 rounded-2xl p-8 text-center border"
            style={{ backgroundColor: "#ffffff", borderColor: "rgba(122, 108, 93, 0.25)" }}
          >
            <p className="text-sm" style={{ color: "#7a6c5d" }}>No purchases yet.</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl p-4 border"
                style={{ backgroundColor: "#ffffff", borderColor: "rgba(122, 108, 93, 0.25)" }}
              >
                {order.productImage ? (
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-full h-28 object-cover rounded-xl mb-3"
                  />
                ) : (
                  <div
                    className="w-full h-28 rounded-xl mb-3 flex items-center justify-center text-2xl"
                    style={{ backgroundColor: "rgba(122, 108, 93, 0.1)" }}
                  >
                    📦
                  </div>
                )}
                <p className="font-medium truncate" style={{ color: "#18020c" }}>
                  {order.productName && order.productName !== "Product unavailable"
                    ? order.productName
                    : "Item no longer available"}
                </p>
                <p className="text-sm mt-1 font-semibold" style={{ color: "#f1b055" }}>
                  ৳{order.amount?.toLocaleString()} <span className="font-normal text-xs text-[#7a6c5d]">· {new Date(order.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}