import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function addProduct(productData) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add product");
  }
  return res.json();
}

export async function updateProduct(id, productData) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update product");
  }
  return res.json();
}

export async function deleteProduct(id, sellerId) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/products/${id}?sellerId=${sellerId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete product");
  }
  return res.json();
}

// POST /api/checkout_sessions — no token needed, Next.js internal route
export async function createCheckoutSession(data) {
  const res = await fetch("/api/checkout_sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create checkout session");
  return res.json();
}