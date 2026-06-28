import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function getBuyerOrders(buyerId, status) {
  const token = await getAuthToken();
  const url = status
    ? `${BASE_URL}/api/orders/buyer/${buyerId}?status=${status}`
    : `${BASE_URL}/api/orders/buyer/${buyerId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch orders");
  }
  return res.json();
}

export async function getSellerOrders(sellerId, status) {
  const token = await getAuthToken();
  const url = status
    ? `${BASE_URL}/api/orders/seller/${sellerId}?status=${status}`
    : `${BASE_URL}/api/orders/seller/${sellerId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch seller orders");
  }
  return res.json();
}