import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// PATCH /api/users/:userEmail — private
export async function updateUser(userEmail, data) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/users/${userEmail}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}