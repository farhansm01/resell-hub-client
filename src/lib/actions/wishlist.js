const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function removeFromWishlist(wishlistId, userId) {
  const res = await fetch(`${BASE_URL}/api/wishlist/${wishlistId}?userId=${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to remove from wishlist");
  }

  return res.json();
}