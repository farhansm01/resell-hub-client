// src/app/(auth)/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const result = await signUp.email({ name, email, password, role });
      if (result?.error) {
        toast.error(result.error.message || "Sign up failed");
      } else {
        toast.success("Account created successfully!");
        router.push("/signin");
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
          <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Create Account</h1>
          <p className="text-sm mt-1" style={{ color: "#78716C" }}>Join ReSellHub and start buying or selling</p>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
            style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
          />
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
              placeholder="Min. 8 characters"
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

        {/* Role Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: "#1C1917" }}>I want to</label>
          <div className="flex gap-3">
            {["buyer", "seller"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition"
                style={{
                  backgroundColor: role === r ? "#F97316" : "#FFFFFF",
                  color: role === r ? "#FFFFFF" : "#1C1917",
                  borderColor: role === r ? "#F97316" : "#E7E5E4",
                }}
              >
                {r === "buyer" ? "Buy Products" : "Sell Products"}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#F97316" }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Redirect */}
        <p className="text-center text-sm" style={{ color: "#78716C" }}>
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold hover:underline" style={{ color: "#F97316" }}>
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}