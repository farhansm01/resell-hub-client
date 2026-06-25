// src/lib/actions/wishlist.js

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// POST /api/wishlist — add product to wishlist
export async function addToWishlist(userId, productId) {
  const res = await fetch(`${BASE_URL}/api/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to add to wishlist");
  return data;
}