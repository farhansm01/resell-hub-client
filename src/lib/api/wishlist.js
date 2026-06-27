const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function getWishlist(userId) {
  const res = await fetch(`${BASE_URL}/api/wishlist/${userId}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch wishlist");
  }

  return res.json();
}