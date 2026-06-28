import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// GET /api/users/:userEmail — private
export async function getUser(userEmail) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/users/${userEmail}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// GET /api/users/top-sellers — public
export async function getTopSellers() {
  const res = await fetch(`${BASE_URL}/api/users/top-sellers`);
  if (!res.ok) throw new Error("Failed to fetch top sellers");
  return res.json();
}