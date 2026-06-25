// src/lib/api/reviews.js

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// GET /api/reviews?productId=:id — fetch reviews for a product
export async function getReviewsByProduct(productId) {
  const res = await fetch(`${BASE_URL}/api/reviews?productId=${productId}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}