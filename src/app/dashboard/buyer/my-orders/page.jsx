"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getBuyerOrders } from "@/lib/api/orders";
import { cancelOrder } from "@/lib/actions/orders";

// Order status badge colors — per spec
const ORDER_STATUS_STYLES = {
  pending: { bg: "#D9770615", text: "#D97706" },
  accepted: { bg: "#3B5BDB15", text: "#3B5BDB" },
  processing: { bg: "#CA8A0415", text: "#CA8A04" },
  shipped: { bg: "#F9731615", text: "#F97316" },
  delivered: { bg: "#16A34A15", text: "#16A34A" },
  cancelled: { bg: "#DC262615", text: "#DC2626" },
};

// Payment status badge colors — reused from Payment History spec for consistency
const PAYMENT_STATUS_STYLES = {
  pending: { bg: "#D9770615", text: "#D97706" },
  paid: { bg: "#16A34A15", text: "#16A34A" },
  failed: { bg: "#DC262615", text: "#DC2626" },
  refunded: { bg: "#3B5BDB15", text: "#3B5BDB" },
};

function Badge({ status, styleMap }) {
  const style = styleMap[status] || styleMap.pending;
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {status}
    </span>
  );
}

export default function MyOrdersPage() {
  const { data: session, isPending } = useSession();
  const buyerId = session?.user?.id;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null); // tracks which order's cancel button is loading

  useEffect(() => {
    if (isPending || !buyerId) return;

    const fetchOrders = async () => {
      try {
        const data = await getBuyerOrders(buyerId);
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load your orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [buyerId, isPending]);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId, buyerId);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: "cancelled" } : o))
      );
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm" style={{ color: "#78716C" }}>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>My Orders</h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Track and manage your orders.
      </p>

      {orders.length === 0 ? (
        <div
          className="mt-6 rounded-2xl p-10 text-center"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
        >
          <p className="text-sm" style={{ color: "#78716C" }}>
            You haven&apos;t placed any orders yet.
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop table ── */}
          <div
            className="mt-6 hidden sm:block rounded-2xl overflow-hidden overflow-x-auto"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #E7E5E4" }}>
                  <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Product</th>
                  <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Amount</th>
                  <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Order Status</th>
                  <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Payment</th>
                  <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Date</th>
                  <th className="text-right px-5 py-3 font-medium" style={{ color: "#78716C" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: "1px solid #E7E5E4" }}>
                    <td className="px-5 py-3 font-medium" style={{ color: "#1C1917" }}>
                      {order.productName}
                    </td>
                    <td className="px-5 py-3" style={{ color: "#1C1917" }}>${order.amount}</td>
                    <td className="px-5 py-3">
                      <Badge status={order.orderStatus} styleMap={ORDER_STATUS_STYLES} />
                    </td>
                    <td className="px-5 py-3">
                      <Badge status={order.paymentStatus} styleMap={PAYMENT_STATUS_STYLES} />
                    </td>
                    <td className="px-5 py-3" style={{ color: "#78716C" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {order.orderStatus === "pending" && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          disabled={cancellingId === order._id}
                          className="text-sm font-medium px-3 py-1.5 rounded-lg border disabled:opacity-60"
                          style={{ borderColor: "#E7E5E4", color: "#DC2626" }}
                        >
                          {cancellingId === order._id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className="mt-6 sm:hidden flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl p-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium" style={{ color: "#1C1917" }}>{order.productName}</p>
                  <Badge status={order.orderStatus} styleMap={ORDER_STATUS_STYLES} />
                </div>
                <p className="text-sm mt-1" style={{ color: "#78716C" }}>
                  ${order.amount} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <Badge status={order.paymentStatus} styleMap={PAYMENT_STATUS_STYLES} />
                </div>
                {order.orderStatus === "pending" && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    disabled={cancellingId === order._id}
                    className="mt-3 w-full text-sm font-medium py-2 rounded-lg border disabled:opacity-60"
                    style={{ borderColor: "#E7E5E4", color: "#DC2626" }}
                  >
                    {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}