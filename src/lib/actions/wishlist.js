import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function addToWishlist(userId, productId) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, productId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add to wishlist");
  return data;
}

export async function removeFromWishlist(wishlistId, userId) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/wishlist/${wishlistId}?userId=${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to remove from wishlist");
  return data;
}