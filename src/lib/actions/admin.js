// src/lib/actions/admin.js
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// PATCH /api/admin/users/:userId/status — block or unblock a user
export async function updateUserStatus(userId, status) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update user status");
  return res.json();
}

// DELETE /api/admin/users/:userId — delete a user
export async function deleteUser(userId) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

// PATCH /api/admin/products/:productId/status — approve or reject a product
export async function updateProductStatus(productId, status) {
  const res = await fetch(`${BASE_URL}/api/admin/products/${productId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update product status");
  return res.json();
}

// DELETE /api/admin/products/:productId — delete any product
export async function deleteAdminProduct(productId) {
  const res = await fetch(`${BASE_URL}/api/admin/products/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

// PATCH /api/admin/orders/:orderId/status — override any order status
export async function updateAdminOrderStatus(orderId, orderStatus) {
  const res = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderStatus }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}