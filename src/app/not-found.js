// app/not-found.js

'use client'

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] px-4">
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
            {/* Ground line */}
            <line x1="10" y1="105" x2="130" y2="105" stroke="#E7E5E4" strokeWidth="2.5" strokeLinecap="round" />

            {/* Person body */}
            <circle cx="52" cy="38" r="12" fill="#FFF7ED" stroke="#F97316" strokeWidth="2.5" />
            {/* Person torso */}
            <path d="M44 58 Q52 52 60 58 L63 80 H41 Z" fill="#FFF7ED" stroke="#F97316" strokeWidth="2" strokeLinejoin="round" />
            {/* Left leg */}
            <line x1="45" y1="80" x2="40" y2="105" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
            {/* Right leg */}
            <line x1="59" y1="80" x2="64" y2="105" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
            {/* Arm holding magnifier */}
            <path d="M60 62 Q75 55 82 58" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Magnifying glass circle */}
            <circle cx="91" cy="60" r="14" fill="#FFF7ED" stroke="#F97316" strokeWidth="3" />
            {/* Magnifying glass handle */}
            <line x1="101" y1="71" x2="112" y2="84" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />

            {/* Question mark inside magnifier */}
            <text x="85" y="65" fontSize="14" fontWeight="bold" fill="#F97316" fontFamily="sans-serif">?</text>

            {/* Floating dots — "lost" feel */}
            <circle cx="20" cy="50" r="3" fill="#F97316" opacity="0.25" />
            <circle cx="28" cy="30" r="2" fill="#F97316" opacity="0.2" />
            <circle cx="120" cy="45" r="3" fill="#F97316" opacity="0.2" />
            <circle cx="115" cy="25" r="2" fill="#F97316" opacity="0.15" />
          </svg>
        </div>

        {/* Large 404 */}
        <h1 className="text-7xl font-extrabold mb-3" style={{ color: "#F97316" }}>
          404
        </h1>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-[#1C1917] mb-3">
          Page Not Found
        </h2>

        {/* Subtext */}
        <p className="text-sm text-[#78716C] mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Back to Home button */}
        <Link
          href="/"
          className="rounded-md px-6 py-2.5 text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#F97316" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#C2410C")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#F97316")}
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}