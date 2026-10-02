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

// GET /api/users/top-sellers — public (enriched with profile image when available)
export async function getTopSellers() {
  const res = await fetch(`${BASE_URL}/api/users/top-sellers`);
  if (!res.ok) throw new Error("Failed to fetch top sellers");
  const sellers = await res.json();

  if (!Array.isArray(sellers)) return [];

  // Try to enrich sellers with profile image from DB if token is available
  try {
    const token = await getAuthToken();
    if (token) {
      const enriched = await Promise.all(
        sellers.map(async (s) => {
          const existingImage = s.image || s.photoURL || s.avatar || s.sellerImage || s.userImage;
          if (s.sellerEmail && !existingImage) {
            try {
              const uRes = await fetch(`${BASE_URL}/api/users/${s.sellerEmail}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (uRes.ok) {
                const uData = await uRes.json();
                return {
                  ...s,
                  image: uData.image || uData.photoURL || uData.avatar || uData.sellerImage,
                };
              }
            } catch (err) {
              // ignore single user fetch error
            }
          }
          return s;
        })
      );
      return enriched;
    }
  } catch (err) {
    // ignore token fetch error for unauthenticated visitors
  }

  return sellers;
}