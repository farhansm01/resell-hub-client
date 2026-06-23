const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function getMyProducts(sellerId) {
  const res = await fetch(`${BASE_URL}/api/products?sellerId=${sellerId}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch products");
  }

  return res.json();
}