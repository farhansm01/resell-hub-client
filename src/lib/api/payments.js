import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function getBuyerPayments(buyerId) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/payments/buyer/${buyerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch payments");
  }
  return res.json();
}