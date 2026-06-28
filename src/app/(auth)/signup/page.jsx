// src/app/(auth)/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { signUp, authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // inline field errors
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const validate = (field, value) => {
    if (field === "name") {
      if (!value.trim()) return "Full name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    }
    if (field === "email") {
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
      return "";
    }
    if (field === "password") {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      return "";
    }
    return "";
  };

  const handleBlur = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  const handleSubmit = async () => {
    const nameErr = validate("name", name);
    const emailErr = validate("email", email);
    const passwordErr = validate("password", password);
    setErrors({ name: nameErr, email: emailErr, password: passwordErr });
    if (nameErr || emailErr || passwordErr) return;

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

  // Google OAuth — role defaults to buyer for Google signups
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Google sign up failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#FAFAF9" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 flex flex-col gap-5">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Create Account</h1>
          <p className="text-sm mt-1" style={{ color: "#78716C" }}>Join ReSell Hub and start buying or selling</p>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => handleBlur("name", e.target.value)}
            className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
            style={{
              borderColor: errors.name ? "#DC2626" : "#E7E5E4",
              color: "#1C1917",
            }}
          />
          {errors.name && (
            <p className="text-xs mt-0.5" style={{ color: "#DC2626" }}>{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => handleBlur("email", e.target.value)}
            className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
            style={{
              borderColor: errors.email ? "#DC2626" : "#E7E5E4",
              color: "#1C1917",
            }}
          />
          {errors.email && (
            <p className="text-xs mt-0.5" style={{ color: "#DC2626" }}>{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => handleBlur("password", e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 transition pr-10"
              style={{
                borderColor: errors.password ? "#DC2626" : "#E7E5E4",
                color: "#1C1917",
              }}
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
          {errors.password && (
            <p className="text-xs mt-0.5" style={{ color: "#DC2626" }}>{errors.password}</p>
          )}
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

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: "#E7E5E4" }} />
          <span className="text-xs font-medium" style={{ color: "#78716C" }}>or continue with</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "#E7E5E4" }} />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full py-2.5 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition hover:bg-gray-50 disabled:opacity-60"
          style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
        >
          <GoogleIcon />
          {googleLoading ? "Redirecting..." : "Sign up with Google"}
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