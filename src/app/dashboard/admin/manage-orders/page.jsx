// app/dashboard/admin/manage-orders/page.js
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FolderOpen } from "@gravity-ui/icons";
import { getAdminOrders } from "@/lib/api/admin";
import { updateAdminOrderStatus } from "@/lib/actions/admin";

const STATUS_TABS = ["all", "pending", "accepted", "processing", "shipped", "delivered", "cancelled"];

// badge color per order status
const statusStyle = (status) => {
  switch (status) {
    case "pending":    return { bg: "#D976061A", text: "#D97706" };
    case "accepted":   return { bg: "#3B5BDB1A", text: "#3B5BDB" };
    case "processing": return { bg: "#CA8A041A", text: "#CA8A04" };
    case "shipped":    return { bg: "#F973161A", text: "#F97316" };
    case "delivered":  return { bg: "#16A34A1A", text: "#16A34A" };
    case "cancelled":  return { bg: "#DC26261A", text: "#DC2626" };
    default:           return { bg: "#E7E5E4",   text: "#78716C" };
  }
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await getAdminOrders({
          status: statusFilter !== "all" ? statusFilter : undefined,
        });
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  // override order status — optimistic update
  const handleStatusChange = async (orderId, newStatus) => {
    const prev = orders.find((o) => o._id.toString() === orderId)?.orderStatus;

    // optimistic
    setOrders((all) =>
      all.map((o) => o._id.toString() === orderId ? { ...o, orderStatus: newStatus } : o)
    );

    try {
      await updateAdminOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update order status");
      // revert
      setOrders((all) =>
        all.map((o) => o._id.toString() === orderId ? { ...o, orderStatus: prev } : o)
      );
    }
  };

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Manage Orders</h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Monitor and override order statuses across the platform.
      </p>

      {/* Status filter tabs */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className="rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors"
            style={{
              backgroundColor: statusFilter === tab ? "#F97316" : "#FFFFFF",
              color: statusFilter === tab ? "#FFFFFF" : "#78716C",
              border: `1px solid ${statusFilter === tab ? "#F97316" : "#E7E5E4"}`,
            }}
          >
            {capitalize(tab)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="mt-10 flex justify-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-4"
            style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
          />
        </div>
      ) : orders.length === 0 ? (
        <div
          className="mt-8 rounded-2xl border p-10 text-center"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
        >
          <FolderOpen width={32} height={32} style={{ color: "#E7E5E4", margin: "0 auto" }} />
          <p className="mt-3 text-sm" style={{ color: "#78716C" }}>No orders found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div
            className="mt-6 hidden md:block rounded-2xl border overflow-hidden"
            style={{ borderColor: "#E7E5E4" }}
          >
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "#F5F5F4" }}>
                <tr>
                  {["Buyer", "Seller", "Amount", "Order Status", "Payment", "Date", "Override"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "#78716C" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#FFFFFF" }}>
                {orders.map((order) => {
                  const oid = order._id.toString();
                  const style = statusStyle(order.orderStatus);

                  return (
                    <tr key={oid} className="border-t" style={{ borderColor: "#E7E5E4" }}>
                      {/* Buyer */}
                      <td className="px-5 py-4">
                        <p className="font-medium" style={{ color: "#1C1917" }}>{order.buyerName}</p>
                        <p className="text-xs" style={{ color: "#78716C" }}>{order.buyerEmail}</p>
                      </td>

                      {/* Seller */}
                      <td className="px-5 py-4" style={{ color: "#78716C" }}>
                        {order.sellerName || "—"}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 font-semibold" style={{ color: "#F97316" }}>
                        ${order.amount?.toLocaleString()}
                      </td>

                      {/* Order status badge */}
                      <td className="px-5 py-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Payment status */}
                      <td className="px-5 py-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
                          style={{
                            backgroundColor: order.paymentStatus === "paid" ? "#16A34A1A" : "#D976061A",
                            color: order.paymentStatus === "paid" ? "#16A34A" : "#D97706",
                          }}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4" style={{ color: "#78716C" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      {/* Override dropdown */}
                      <td className="px-5 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(oid, e.target.value)}
                          className="rounded-lg border px-3 py-1.5 text-xs outline-none"
                          style={{
                            borderColor: "#E7E5E4",
                            color: "#1C1917",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          {STATUS_TABS.filter((s) => s !== "all").map((s) => (
                            <option key={s} value={s}>{capitalize(s)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {orders.map((order) => {
              const oid = order._id.toString();
              const style = statusStyle(order.orderStatus);

              return (
                <div
                  key={oid}
                  className="rounded-2xl border p-4"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
                >
                  {/* Buyer + seller */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm" style={{ color: "#1C1917" }}>
                        {order.buyerName}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#78716C" }}>{order.buyerEmail}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#78716C" }}>
                        Seller: {order.sellerName || "—"}
                      </p>
                    </div>
                    <span className="font-semibold text-sm shrink-0" style={{ color: "#F97316" }}>
                      ${order.amount?.toLocaleString()}
                    </span>
                  </div>

                  {/* Badges + date */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
                      style={{ backgroundColor: style.bg, color: style.text }}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
                      style={{
                        backgroundColor: order.paymentStatus === "paid" ? "#16A34A1A" : "#D976061A",
                        color: order.paymentStatus === "paid" ? "#16A34A" : "#D97706",
                      }}
                    >
                      {order.paymentStatus}
                    </span>
                    <span className="text-xs ml-auto" style={{ color: "#78716C" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Override dropdown */}
                  <div className="mt-3 border-t pt-3" style={{ borderColor: "#E7E5E4" }}>
                    <label className="text-xs font-medium" style={{ color: "#78716C" }}>
                      Override Status
                    </label>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(oid, e.target.value)}
                      className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                      style={{
                        borderColor: "#E7E5E4",
                        color: "#1C1917",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      {STATUS_TABS.filter((s) => s !== "all").map((s) => (
                        <option key={s} value={s}>{capitalize(s)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}