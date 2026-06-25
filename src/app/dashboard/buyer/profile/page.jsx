// app/dashboard/buyer/profile/page.js

"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { getUser } from "@/lib/api/users";
import { updateUser } from "@/lib/actions/users";
import { toast } from "react-toastify";

export default function BuyerProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userEmail = user?.email; // use email as identifier — avoids ObjectId issues

  // ── Profile form state ──────────────────────────────────────────────
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ── Password form state ─────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Fetch full user doc on mount ────────────────────────────────────
  useEffect(() => {
    if (!userEmail) return;
    getUser(userEmail)
      .then((data) => {
        setName(data.name || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setImageUrl(data.image || "");
      })
      .catch(() => {
        setName(user?.name || "");
      });
  }, [userEmail]);

  // ── Pick image file → local preview ────────────────────────────────
  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Upload to imgbb → return hosted URL ────────────────────────────
  const uploadToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.data.url;
  };

  // ── Save profile ────────────────────────────────────────────────────
  const handleProfileSave = async () => {
    if (!userEmail) return;
    setProfileLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadToImgbb(imageFile);
      }
      await updateUser(userEmail, {
        name,
        phone,
        location,
        image: finalImageUrl,
      });
      setImageUrl(finalImageUrl);
      setImageFile(null);
      setImagePreview("");
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Change password via BetterAuth client ───────────────────────────
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setPasswordLoading(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (result?.error) throw new Error(result.error.message);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Avatar — imgbb URL, local preview, or initials fallback ────────
  const displayAvatar = imagePreview || imageUrl;
  const initials = name ? name.charAt(0).toUpperCase() : "U";

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent"
          style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>
          Profile Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "#78716C" }}>
          Manage your personal information and account security
        </p>
      </div>

      {/* ── Section 1: Update Profile ───────────────────────────────── */}
      <div
        className="rounded-xl p-6 shadow-sm border"
        style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}
      >
        <h2 className="text-lg font-semibold mb-6" style={{ color: "#1C1917" }}>
          Update Profile
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-6">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Profile avatar"
              className="w-24 h-24 rounded-full object-cover border-2"
              style={{ borderColor: "#F97316" }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
              style={{ backgroundColor: "#F97316" }}
            >
              {initials}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePick}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-medium px-4 py-1.5 rounded-full border transition-colors hover:bg-orange-50"
            style={{ borderColor: "#F97316", color: "#F97316" }}
          >
            Change Photo
          </button>

          {imageFile && (
            <p className="text-xs" style={{ color: "#78716C" }}>
              {imageFile.name} selected — will upload on save
            </p>
          )}
        </div>

        {/* Form fields */}
        <div className="space-y-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-orange-400"
              style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FAFAF9" }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+8801XXXXXXXXX"
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-orange-400"
              style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FAFAF9" }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dhaka, Bangladesh"
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-orange-400"
              style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FAFAF9" }}
            />
          </div>
        </div>

        <button
          onClick={handleProfileSave}
          disabled={profileLoading}
          className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#F97316" }}
        >
          {profileLoading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* ── Section 2: Change Password ──────────────────────────────── */}
      <div
        className="rounded-xl p-6 shadow-sm border"
        style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}
      >
        <h2 className="text-lg font-semibold mb-6" style={{ color: "#1C1917" }}>
          Change Password
        </h2>

        <div className="space-y-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-colors focus:border-blue-400"
                style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FAFAF9" }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#78716C" }}
              >
                {showCurrent ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-colors focus:border-blue-400"
                style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FAFAF9" }}
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#78716C" }}
              >
                {showNew ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-colors focus:border-blue-400"
                style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FAFAF9" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#78716C" }}
              >
                {showConfirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
                Passwords do not match
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={passwordLoading}
          className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#3B5BDB" }}
        >
          {passwordLoading ? "Changing..." : "Change Password"}
        </button>
      </div>

    </div>
  );
}