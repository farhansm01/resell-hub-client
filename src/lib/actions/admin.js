import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function updateUserStatus(userId, status) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update user status");
  return res.json();
}

export async function deleteUser(userId) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

export async function updateProductStatus(productId, status) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/admin/products/${productId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update product status");
  return res.json();
}

export async function deleteAdminProduct(productId) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/admin/products/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function updateAdminOrderStatus(orderId, orderStatus) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderStatus }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}