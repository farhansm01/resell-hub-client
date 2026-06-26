"use client";

import { useState, useEffect } from "react";
import {
  Person,
  Envelope,
  Box,
  CircleDollar,
  MapPin,
  Handset,
  Calendar,
  ChevronDown,
} from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getSellerOrders } from "@/lib/api/orders";
import { updateOrderStatus } from "@/lib/actions/orders";

// Status flow — seller can only move forward
const STATUS_FLOW = ["pending", "accepted", "processing", "shipped", "delivered"];

// Badge colors per status
const STATUS_COLORS = {
  pending:    { bg: "#D9770615", text: "#D97706" },
  accepted:   { bg: "#3B5BDB15", text: "#3B5BDB" },
  processing: { bg: "#CA8A0415", text: "#CA8A04" },
  shipped:    { bg: "#F9731615", text: "#F97316" },
  delivered:  { bg: "#16A34A15", text: "#16A34A" },
  cancelled:  { bg: "#DC262615", text: "#DC2626" },
};

const FILTER_TABS = ["all", "pending", "accepted", "processing", "shipped", "delivered", "cancelled"];

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {status}
    </span>
  );
}

// Next valid statuses the seller can move to from current
function getNextStatuses(current) {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return [];
  return STATUS_FLOW.slice(idx + 1);
}

// Inline custom select for status update (consistent with rest of project)
// FIX (Bug 3): select is now controlled via `value` instead of `defaultValue`.
// A useEffect resets `value` back to "" whenever `currentStatus` changes —
// which happens after the parent's optimistic update — so the dropdown
// shows "Move to..." again instead of staying stuck on the last pick.
function StatusSelect({ orderId, currentStatus, sellerId, onUpdated }) {
  const nextOptions = getNextStatuses(currentStatus);
  const isDisabled = nextOptions.length === 0; // delivered or cancelled

  const [isUpdating, setIsUpdating] = useState(false);
  const [value, setValue] = useState("");

  // reset dropdown placeholder whenever the order's status actually changes
  useEffect(() => {
    setValue("");
  }, [currentStatus]);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus) return;

    setValue(newStatus);
    setIsUpdating(true);

    try {
      await updateOrderStatus(orderId, sellerId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      onUpdated(orderId, newStatus); // optimistic local update -> currentStatus changes -> effect resets value
    } catch (err) {
      toast.error(err.message || "Failed to update status");
      setValue(""); // reset on failure too
    } finally {
      setIsUpdating(false);
    }
  };

  if (isDisabled) {
    return (
      <span className="text-xs text-[#78716C] italic">
        {currentStatus === "cancelled" ? "Cancelled" : "Delivered ✓"}
      </span>
    );
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={handleChange}
        disabled={isUpdating}
        className="w-full appearance-none px-3 py-2 pr-8 text-sm rounded-xl border outline-none transition disabled:opacity-60 cursor-pointer"
        style={{
          borderColor: "#E7E5E4",
          color: "#1C1917",
          backgroundColor: "#FFFFFF",
        }}
      >
        <option value="" disabled>Move to...</option>
        {nextOptions.map((s) => (
          <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
      {/* chevron icon */}
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
        <ChevronDown width={14} height={14} style={{ color: "#78716C" }} />
      </span>
    </div>
  );
}

export default function ManageOrdersPage() {
  const { data: session, isPending } = useSession();
  const sellerId = session?.user?.id;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (isPending || !sellerId) return;
    const fetch = async () => {
      try {
        const data = await getSellerOrders(sellerId);
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [sellerId, isPending]);

  // Optimistic local status update
  const handleStatusUpdated = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const filtered = activeFilter === "all"
    ? orders
    : orders.filter((o) => o.orderStatus === activeFilter);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-[#78716C]">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1917]">Manage Orders</h1>
      <p className="mt-1 text-sm text-[#78716C]">
        View and update the status of orders placed for your products.
      </p>

      {/* ── Filter tabs ── */}
      <div className="mt-5 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
            style={{
              backgroundColor: activeFilter === tab ? "#F97316" : "#FFFFFF",
              color: activeFilter === tab ? "#FFFFFF" : "#78716C",
              border: `1px solid ${activeFilter === tab ? "#F97316" : "#E7E5E4"}`,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="mt-6 rounded-2xl p-10 text-center"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
        >
          <p className="text-sm text-[#78716C]">No orders found.</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table ── */}
          <div
            className="mt-6 hidden lg:block rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #E7E5E4" }}>
                  {["Buyer", "Product / Amount", "Delivery Info", "Date", "Status", "Action"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-medium text-[#78716C]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order._id} style={{ borderBottom: "1px solid #E7E5E4" }}>
                    {/* Buyer */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
                          <Person width={13} height={13} style={{ color: "#78716C" }} />
                          {order.buyerName}
                        </span>
                        <span className="text-xs text-[#78716C] flex items-center gap-1.5">
                          <Envelope width={12} height={12} />
                          {order.buyerEmail}
                        </span>
                      </div>
                    </td>

                    {/* Product / Amount */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#1C1917] flex items-center gap-1.5">
                          <Box width={13} height={13} style={{ color: "#78716C" }} />
                          {order.productName || order.productId}
                        </span>
                        <span className="text-sm font-semibold flex items-center gap-1" style={{ color: "#F97316" }}>
                          <CircleDollar width={13} height={13} />
                          ${order.amount}
                        </span>
                      </div>
                    </td>

                    {/* Delivery Info */}
                    <td className="px-5 py-4">
                      {order.deliveryInfo ? (
                        <div className="flex flex-col gap-0.5 text-xs text-[#78716C]">
                          <span className="flex items-center gap-1.5">
                            <Person width={12} height={12} /> {order.deliveryInfo.name}
                          </span>
                          {/* FIX (Bug 1): was order.deliveryInfo.Handset (icon name), now .phone */}
                          <span className="flex items-center gap-1.5">
                            <Handset width={12} height={12} /> {order.deliveryInfo.phone}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin width={12} height={12} /> {order.deliveryInfo.address}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#78716C]">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <span className="text-xs text-[#78716C] flex items-center gap-1.5">
                        <Calendar width={12} height={12} />
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 min-w-[140px]">
                      <StatusSelect
                        orderId={order._id}
                        currentStatus={order.orderStatus}
                        sellerId={sellerId}
                        onUpdated={handleStatusUpdated}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className="mt-6 lg:hidden flex flex-col gap-3">
            {filtered.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
              >
                {/* Top row: buyer + status badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-[#1C1917] flex items-center gap-1.5 text-sm">
                      <Person width={13} height={13} style={{ color: "#78716C" }} />
                      {order.buyerName}
                    </span>
                    <span className="text-xs text-[#78716C] flex items-center gap-1.5">
                      <Envelope width={12} height={12} />
                      {order.buyerEmail}
                    </span>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                </div>

                {/* Product + amount */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1C1917] flex items-center gap-1.5">
                    <Box width={13} height={13} style={{ color: "#78716C" }} />
                    {order.productName || order.productId}
                  </span>
                  <span className="text-sm font-semibold flex items-center gap-1" style={{ color: "#F97316" }}>
                    <CircleDollar width={13} height={13} />${order.amount}
                  </span>
                </div>

                {/* Delivery info */}
                {order.deliveryInfo && (
                  <div className="flex flex-col gap-0.5 text-xs text-[#78716C]">
                    <span className="flex items-center gap-1.5"><Person width={12} height={12} />{order.deliveryInfo.name}</span>
                    <span className="flex items-center gap-1.5"><Handset width={12} height={12} />{order.deliveryInfo.phone}</span>
                    <span className="flex items-center gap-1.5"><MapPin width={12} height={12} />{order.deliveryInfo.address}</span>
                  </div>
                )}

                {/* Date + action */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-[#78716C] flex items-center gap-1.5">
                    <Calendar width={12} height={12} />
                    {formatDate(order.createdAt)}
                  </span>
                  <div className="w-36">
                    <StatusSelect
                      orderId={order._id}
                      currentStatus={order.orderStatus}
                      sellerId={sellerId}
                      onUpdated={handleStatusUpdated}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}