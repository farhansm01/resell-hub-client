import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getAdminStats() {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function getAdminUsers({ role, search } = {}) {
  const token = await getAuthToken();
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (search) params.set("search", search);

  const res = await fetch(`${BASE_URL}/api/admin/users?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function getAdminProducts({ status, search, category } = {}) {
  const token = await getAuthToken();
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  if (category) params.set("category", category);

  const res = await fetch(`${BASE_URL}/api/admin/products?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getAdminOrders({ status } = {}) {
  const token = await getAuthToken();
  const params = new URLSearchParams();
  if (status) params.set("status", status);

  const res = await fetch(`${BASE_URL}/api/admin/orders?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function getAdminPayments({ status, search } = {}) {
  const token = await getAuthToken();
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const res = await fetch(`${BASE_URL}/api/admin/payments?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}