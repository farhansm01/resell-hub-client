import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function createPayment(data) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create payment");
  }
  return res.json();
}