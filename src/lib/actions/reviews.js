import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function submitReview({ productId, buyerId, buyerName, rating, comment }) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, buyerId, buyerName, rating, comment }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to submit review");
  return data;
}