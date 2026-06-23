// Centralized mutation layer for product-related API calls.
// Base URL pulled from env — matches NEXT_PUBLIC_BASE_URL in your .env.local (http://localhost:5000)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";


export async function addProduct(productData) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add product");
  }

  return res.json();
}


export async function updateProduct(id, productData) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update product");
  }

  return res.json();
}

export async function deleteProduct(id, sellerId) {
  const res = await fetch(`${BASE_URL}/api/products/${id}?sellerId=${sellerId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete product");
  }

  return res.json();
}