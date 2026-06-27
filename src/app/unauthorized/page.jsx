// app/unauthorized/page.js
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Capitalize first letter for display e.g. "seller" → "Seller"
  const role = session?.user?.role;
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : null;

  // Role-based dashboard link
  const dashboardHref = role ? `/dashboard/${role}` : "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] px-4">
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
            {/* Shield body */}
            <path
              d="M60 10L18 28V58C18 82 36.8 104.2 60 110C83.2 104.2 102 82 102 58V28L60 10Z"
              fill="#FEF2F2"
              stroke="#DC2626"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Lock body */}
            <rect x="44" y="58" width="32" height="24" rx="4" fill="#DC2626" />
            {/* Lock shackle */}
            <path
              d="M48 58V50C48 44.477 51.477 41 57 41H63C68.523 41 72 44.477 72 50V58"
              stroke="#DC2626"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Keyhole */}
            <circle cx="60" cy="68" r="3.5" fill="white" />
            <rect x="58.5" y="69" width="3" height="6" rx="1" fill="white" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#1C1917] mb-3">
          Access Denied
        </h1>

        {/* Subtext */}
        <p className="text-sm text-[#78716C] mb-6 leading-relaxed">
          You don&apos;t have permission to view this page.
        </p>

        {/* Role badge — only shown if logged in */}
        {displayRole && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E7E5E4] bg-white px-4 py-2 text-sm font-medium text-[#78716C] shadow-sm">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "#DC2626" }}
            />
            You are logged in as:{" "}
            <span className="font-semibold text-[#1C1917]">{displayRole}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push(dashboardHref)}
            className="rounded-md px-6 py-2.5 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#F97316" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#C2410C")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#F97316")}
          >
            Go to My Dashboard
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-md border border-[#E7E5E4] bg-white px-6 py-2.5 text-sm font-semibold text-[#1C1917] transition-colors hover:bg-[#F5F5F4]"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}