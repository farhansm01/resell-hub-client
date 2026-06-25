const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function cancelOrder(orderId, buyerId) {
  const res = await fetch(`${BASE_URL}/api/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ buyerId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to cancel order");
  }

  return res.json();
}