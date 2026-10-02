// app/not-found.js

'use client'

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#ffffff" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-md w-full"
      >
        {/* Lost person searching SVG illustration */}
        <div className="mb-8">
          <svg
            width="140"
            height="120"
            viewBox="0 0 140 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="10" y1="105" x2="130" y2="105" stroke="#7a6c5d" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
            <circle cx="52" cy="38" r="12" fill="rgba(241, 176, 85, 0.15)" stroke="#f1b055" strokeWidth="2.5" />
            <path d="M44 58 Q52 52 60 58 L63 80 H41 Z" fill="rgba(241, 176, 85, 0.15)" stroke="#f1b055" strokeWidth="2" strokeLinejoin="round" />
            <line x1="45" y1="80" x2="40" y2="105" stroke="#f1b055" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="59" y1="80" x2="64" y2="105" stroke="#f1b055" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M60 62 Q75 55 82 58" stroke="#f1b055" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="91" cy="60" r="14" fill="rgba(241, 176, 85, 0.15)" stroke="#f1b055" strokeWidth="3" />
            <line x1="101" y1="71" x2="112" y2="84" stroke="#f1b055" strokeWidth="3.5" strokeLinecap="round" />
            <text x="85" y="65" fontSize="14" fontWeight="bold" fill="#f1b055" fontFamily="sans-serif">?</text>
            <circle cx="20" cy="50" r="3" fill="#f1b055" opacity="0.25" />
            <circle cx="28" cy="30" r="2" fill="#f1b055" opacity="0.2" />
            <circle cx="120" cy="45" r="3" fill="#f1b055" opacity="0.2" />
            <circle cx="115" cy="25" r="2" fill="#f1b055" opacity="0.15" />
          </svg>
        </div>

        {/* Large 404 */}
        <h1 className="text-7xl font-extrabold mb-3" style={{ color: "#f1b055" }}>
          404
        </h1>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-3" style={{ color: "#18020c" }}>
          Page Not Found
        </h2>

        {/* Subtext */}
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#7a6c5d" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Back to Home button */}
        <Link
          href="/"
          className="rounded-xl px-6 py-2.5 text-sm font-bold transition-all shadow-sm"
          style={{ backgroundColor: "#f1b055", color: "#18020c" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e09f44")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f1b055")}
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}