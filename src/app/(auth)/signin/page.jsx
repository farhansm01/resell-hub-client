// src/app/(auth)/signin/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn.email({ email, password });
      if (result?.error) {
        toast.error(result.error.message || "Sign in failed");
      } else {
        toast.success("Welcome back!");
        router.push("/");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#FAFAF9" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 flex flex-col gap-5">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Welcome Back</h1>
          <p className="text-sm mt-1" style={{ color: "#78716C" }}>Sign in to your ReSellHub account</p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
            style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 transition pr-10"
              style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#78716C" }}
            >
              {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#F97316" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Redirect */}
        <p className="text-center text-sm" style={{ color: "#78716C" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold hover:underline" style={{ color: "#F97316" }}>
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}