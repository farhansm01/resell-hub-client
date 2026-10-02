// src/lib/api/feedback.js
import { getAuthToken } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// Submit feedback (Public / Logged in)
export async function submitFeedback({ name, email, role, rating, comment }) {
  const res = await fetch(`${BASE_URL}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role, rating, comment }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit feedback");
  }
  return res.json();
}

// Fetch approved feedback for homepage
export async function getApprovedFeedback() {
  const res = await fetch(`${BASE_URL}/api/feedback/approved`);
  if (!res.ok) throw new Error("Failed to fetch feedback");
  return res.json();
}

// Admin: Fetch all feedback
export async function getAdminFeedback({ status = "all", search = "" } = {}) {
  const token = await getAuthToken();
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (search) params.set("search", search);

  const res = await fetch(`${BASE_URL}/api/admin/feedback?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch admin feedback");
  return res.json();
}

// Admin: Update feedback status (approved, pending, rejected)
export async function updateAdminFeedbackStatus(id, status) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/admin/feedback/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update feedback status");
  return res.json();
}

// Admin: Delete feedback
export async function deleteAdminFeedback(id) {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/admin/feedback/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete feedback");
  return res.json();
}
