// src/lib/api/users.js

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// GET /api/users/:userEmail — fetch full user doc by email
export async function getUser(userEmail) {
  const res = await fetch(`${BASE_URL}/api/users/${userEmail}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}


// GET /api/users/top-sellers — sellers with most approved product listings
export async function getTopSellers() {
  const res = await fetch(`${BASE_URL}/api/users/top-sellers`);
  if (!res.ok) throw new Error("Failed to fetch top sellers");
  return res.json();
}