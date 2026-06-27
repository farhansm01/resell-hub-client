// app/dashboard/admin/manage-payments/page.js
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ChartColumn } from "@gravity-ui/icons";
import { getAdminPayments } from "@/lib/api/admin";

const STATUS_TABS = ["all", "paid", "pending", "failed", "refunded"];

// badge color per payment status
const statusStyle = (status) => {
  switch (status) {
    case "paid":      return { bg: "#16A34A1A", text: "#16A34A" };
    case "pending":   return { bg: "#D976061A", text: "#D97706" };
    case "failed":    return { bg: "#DC26261A", text: "#DC2626" };
    case "refunded":  return { bg: "#3B5BDB1A", text: "#3B5BDB" };
    default:          return { bg: "#E7E5E4",   text: "#78716C" };
  }
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ManagePaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const data = await getAdminPayments({
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: search || undefined,
        });
        setPayments(data);
      } catch (err) {
        toast.error("Failed to load payments");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [statusFilter, search]);

  // total revenue — sum of all paid payments currently in view
  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Manage Payments</h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Monitor all platform transactions.
      </p>

      {/* Total revenue card */}
      <div
        className="mt-6 flex items-center gap-4 rounded-2xl border p-5 w-full sm:max-w-xs shadow-sm"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#F973161A" }}
        >
          <ChartColumn width={22} height={22} style={{ color: "#F97316" }} />
        </div>
        <div>
          <p className="text-sm" style={{ color: "#78716C" }}>Total Revenue (Paid)</p>
          <p className="text-xl font-bold" style={{ color: "#1C1917" }}>
            {isLoading ? "..." : `$${totalRevenue.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Search + filter tabs */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search by transaction ID */}
        <input
          type="text"
          placeholder="Search by transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none sm:max-w-xs"
          style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
          onFocus={(e) => (e.target.style.borderColor = "#F97316")}
          onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
        />

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap">
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
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="mt-10 flex justify-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-4"
            style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
          />
        </div>
      ) : payments.length === 0 ? (
        <div
          className="mt-8 rounded-2xl border p-10 text-center"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
        >
          <ChartColumn width={32} height={32} style={{ color: "#E7E5E4", margin: "0 auto" }} />
          <p className="mt-3 text-sm" style={{ color: "#78716C" }}>No payments found.</p>
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
                  {["Transaction ID", "Buyer ID", "Amount", "Status", "Date"].map((h) => (
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
                {payments.map((payment) => {
                  const pid = payment._id.toString();
                  const style = statusStyle(payment.paymentStatus);

                  return (
                    <tr key={pid} className="border-t" style={{ borderColor: "#E7E5E4" }}>
                      {/* Transaction ID — truncated monospace */}
                      <td className="px-5 py-4">
                        <span
                          className="font-mono text-xs rounded px-2 py-1"
                          style={{ backgroundColor: "#F5F5F4", color: "#1C1917" }}
                          title={payment.transactionId}
                        >
                          {payment.transactionId?.slice(0, 24)}…
                        </span>
                      </td>

                      {/* Buyer ID */}
                      <td className="px-5 py-4">
                        <span
                          className="font-mono text-xs"
                          style={{ color: "#78716C" }}
                        >
                          {payment.buyerId?.slice(0, 16)}…
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 font-semibold" style={{ color: "#F97316" }}>
                        ${payment.amount?.toLocaleString()}
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4" style={{ color: "#78716C" }}>
                        {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {payments.map((payment) => {
              const pid = payment._id.toString();
              const style = statusStyle(payment.paymentStatus);

              return (
                <div
                  key={pid}
                  className="rounded-2xl border p-4"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
                >
                  {/* Transaction ID */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: "#78716C" }}>
                        Transaction ID
                      </p>
                      <p
                        className="font-mono text-xs mt-0.5 truncate"
                        style={{ color: "#1C1917" }}
                      >
                        {payment.transactionId}
                      </p>
                    </div>
                    {/* Status badge */}
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold capitalize shrink-0"
                      style={{ backgroundColor: style.bg, color: style.text }}
                    >
                      {payment.paymentStatus}
                    </span>
                  </div>

                  {/* Amount + date */}
                  <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: "#E7E5E4" }}>
                    <span className="font-semibold" style={{ color: "#F97316" }}>
                      ${payment.amount?.toLocaleString()}
                    </span>
                    <span className="text-xs" style={{ color: "#78716C" }}>
                      {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Buyer ID */}
                  <p className="mt-2 font-mono text-xs truncate" style={{ color: "#78716C" }}>
                    Buyer: {payment.buyerId}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}