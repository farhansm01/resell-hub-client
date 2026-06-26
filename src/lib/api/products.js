// src/lib/api/products.js

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// GET /api/products — with search, category, sort, pagination
export async function getProducts({ search = "", category = "", sort = "", page = 1, limit = 9 } = {}) {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(category && category !== "all" && { category }),
    ...(sort && { sort }),
    page,
    limit,
  });

  const res = await fetch(`${BASE_URL}/api/products?${params}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// GET /api/products/:id — single product
export async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// GET /api/products?sellerId= — fetch seller's own listings (all statuses)
export async function getMyProducts(sellerId) {
  const res = await fetch(`${BASE_URL}/api/products?sellerId=${sellerId}`);
  if (!res.ok) throw new Error("Failed to fetch your products");
  return res.json();
}