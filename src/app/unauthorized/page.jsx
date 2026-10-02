// app/unauthorized/page.js
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const role = session?.user?.role;
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : null;
  const dashboardHref = role ? `/dashboard/${role}` : "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#ffffff" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-md w-full"
      >
        {/* Shield SVG illustration */}
        <div className="mb-8">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M60 10L18 28V58C18 82 36.8 104.2 60 110C83.2 104.2 102 82 102 58V28L60 10Z"
              fill="#FEF2F2"
              stroke="#DC2626"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <rect x="44" y="58" width="32" height="24" rx="4" fill="#DC2626" />
            <path
              d="M48 58V50C48 44.477 51.477 41 57 41H63C68.523 41 72 44.477 72 50V58"
              stroke="#DC2626"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="60" cy="68" r="3.5" fill="white" />
            <rect x="58.5" y="69" width="3" height="6" rx="1" fill="white" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#18020c" }}>
          Access Denied
        </h1>

        {/* Subtext */}
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#7a6c5d" }}>
          You don&apos;t have permission to view this page.
        </p>

        {/* Role badge */}
        {displayRole && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-xs" style={{ borderColor: "rgba(122, 108, 93, 0.25)", backgroundColor: "#ffffff", color: "#7a6c5d" }}>
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#DC2626" }}
            />
            You are logged in as:{" "}
            <span className="font-semibold" style={{ color: "#18020c" }}>{displayRole}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push(dashboardHref)}
            className="rounded-xl px-6 py-2.5 text-sm font-bold transition-all shadow-xs"
            style={{ backgroundColor: "#f1b055", color: "#18020c" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e09f44")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f1b055")}
          >
            Go to My Dashboard
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-stone-50"
            style={{ borderColor: "rgba(122, 108, 93, 0.3)", backgroundColor: "#ffffff", color: "#18020c" }}
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}