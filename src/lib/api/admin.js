// src/lib/api/admin.js
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// GET /api/admin/stats — platform totals
export async function getAdminStats() {
  const res = await fetch(`${BASE_URL}/api/admin/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

// GET /api/admin/users — all users, optional role + search filters
export async function getAdminUsers({ role, search } = {}) {
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (search) params.set("search", search);

  const res = await fetch(`${BASE_URL}/api/admin/users?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// GET /api/admin/products — all products, optional status + search + category
export async function getAdminProducts({ status, search, category } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  if (category) params.set("category", category);

  const res = await fetch(`${BASE_URL}/api/admin/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// GET /api/admin/orders — all orders, optional status filter
export async function getAdminOrders({ status } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);

  const res = await fetch(`${BASE_URL}/api/admin/orders?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

// GET /api/admin/payments — all payments, optional status + search
export async function getAdminPayments({ status, search } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const res = await fetch(`${BASE_URL}/api/admin/payments?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}