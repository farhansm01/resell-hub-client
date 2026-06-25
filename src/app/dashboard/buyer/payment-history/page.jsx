"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getBuyerPayments } from "@/lib/api/payments";

const PAYMENT_STATUS_STYLES = {
  pending: { bg: "#D9770615", text: "#D97706" },
  paid: { bg: "#16A34A15", text: "#16A34A" },
  failed: { bg: "#DC262615", text: "#DC2626" },
  refunded: { bg: "#3B5BDB15", text: "#3B5BDB" },
};

function Badge({ status }) {
  const style = PAYMENT_STATUS_STYLES[status] || PAYMENT_STATUS_STYLES.pending;
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {status}
    </span>
  );
}

export default function PaymentHistoryPage() {
  const { data: session, isPending } = useSession();
  const buyerId = session?.user?.id;

  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPending || !buyerId) return;

    const fetchPayments = async () => {
      try {
        const data = await getBuyerPayments(buyerId);
        setPayments(data);
      } catch (err) {
        toast.error("Failed to load payment history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [buyerId, isPending]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm" style={{ color: "#78716C" }}>Loading payment history...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Payment History</h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Your past transactions.
      </p>

      {payments.length === 0 ? (
        <div
          className="mt-6 rounded-2xl p-10 text-center"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
        >
          <p className="text-sm" style={{ color: "#78716C" }}>No payments yet.</p>
        </div>
      ) : (
        <div
          className="mt-6 rounded-2xl overflow-x-auto"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
        >
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #E7E5E4" }}>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Transaction ID</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Amount</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Status</th>
                <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} style={{ borderBottom: "1px solid #E7E5E4" }}>
                  <td className="px-5 py-3 font-mono text-xs" style={{ color: "#1C1917" }}>
                    {payment.transactionId}
                  </td>
                  <td className="px-5 py-3" style={{ color: "#1C1917" }}>${payment.amount}</td>
                  <td className="px-5 py-3"><Badge status={payment.status} /></td>
                  <td className="px-5 py-3" style={{ color: "#78716C" }}>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}