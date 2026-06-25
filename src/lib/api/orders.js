const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// status is optional — used later by the Write a Review page to fetch only delivered orders
export async function getBuyerOrders(buyerId, status) {
  const url = status
    ? `${BASE_URL}/api/orders/buyer/${buyerId}?status=${status}`
    : `${BASE_URL}/api/orders/buyer/${buyerId}`;

  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch orders");
  }

  return res.json();
}