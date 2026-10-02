// components/home/SuccessStories.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StarFill, Comments } from "@gravity-ui/icons";
import { getApprovedFeedback } from "@/lib/api/feedback";

function UserAvatar({ name, image }) {
  const [imgError, setImgError] = useState(false);

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={name || "User"}
        onError={() => setImgError(true)}
        className="shrink-0 w-12 h-12 rounded-full object-cover shadow-xs border border-[#f1b055]/40"
      />
    );
  }

  const initials = (name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-sm shadow-xs"
      style={{ background: "#18020c", color: "#f1b055" }}
    >
      {initials}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function SuccessStories() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function loadFeedback() {
      try {
        const data = await getApprovedFeedback();
        setFeedbackList(data || []);
      } catch (err) {
        setFeedbackList([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeedback();
  }, []);

  // Automatic Framer Motion Carousel Rotation (Every 3.8s, pauses on hover)
  useEffect(() => {
    if (isHovered || feedbackList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % feedbackList.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isHovered, feedbackList.length]);

  const len = feedbackList.length;
  const prevIdx = len > 0 ? (activeIdx - 1 + len) % len : 0;
  const nextIdx = len > 0 ? (activeIdx + 1) % len : 0;

  return (
    <section
      className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t selection:bg-[#f1b055] selection:text-[#18020c] select-none"
      style={{ background: "#ffffff", borderColor: "rgba(122, 108, 93, 0.15)" }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: "#18020c" }}>
            Community Voices
          </h2>
          <p className="mt-2.5 text-sm sm:text-base font-medium" style={{ color: "#7a6c5d" }}>
            What our community thinks about ReSellHub.
          </p>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="max-w-3xl mx-auto h-64 rounded-3xl animate-pulse bg-stone-100 border border-stone-200" />
        ) : len === 0 ? (
          /* Tasteful Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto rounded-3xl border p-8 sm:p-10 text-center shadow-sm relative overflow-hidden"
            style={{ backgroundColor: "#fdf6ea", borderColor: "rgba(241, 176, 85, 0.35)" }}
          >
            <div className="w-14 h-14 rounded-full bg-white border border-[#f1b055]/40 flex items-center justify-center mx-auto mb-4 text-[#f1b055] shadow-xs">
              <StarFill width={24} height={24} />
            </div>

            <h3 className="text-xl font-black" style={{ color: "#18020c" }}>
              Be the first to share your experience!
            </h3>

            <p className="mt-2 text-sm font-medium" style={{ color: "#7a6c5d" }}>
              No community feedback has been published yet. Share your experience with ReSellHub to be featured here.
            </p>

            <div className="mt-6">
              <Link href="/feedback">
                <button
                  className="px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider text-[#18020c] transition hover:opacity-90 cursor-pointer shadow-md"
                  style={{ backgroundColor: "#f1b055" }}
                >
                  Share Feedback
                </button>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Testimonial Carousel Stage */
          <div
            className="relative w-full max-w-6xl mx-auto flex flex-col items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Desktop 3D Automatic Carousel (3 Cards) */}
            <div className="hidden sm:grid grid-cols-12 gap-5 items-center w-full min-h-[320px]">
              
              {/* Left/Previous Review Card */}
              <motion.div
                key={`prev-${prevIdx}`}
                initial={{ opacity: 0.4, scale: 0.85 }}
                animate={{ opacity: 0.65, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                onClick={() => setActiveIdx(prevIdx)}
                className="col-span-3 cursor-pointer"
              >
                <div
                  className="rounded-3xl p-6 bg-white border shadow-md flex flex-col justify-between h-[280px] hover:shadow-lg transition-shadow"
                  style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <UserAvatar
                        name={feedbackList[prevIdx]?.name}
                        image={feedbackList[prevIdx]?.image || feedbackList[prevIdx]?.avatar || feedbackList[prevIdx]?.userImage}
                      />
                      <div className="truncate">
                        <h4 className="font-bold text-sm text-[#18020c] truncate">
                          {feedbackList[prevIdx]?.name}
                        </h4>
                        <span className="text-xs font-semibold text-[#7a6c5d]">
                          {feedbackList[prevIdx]?.role || "Buyer"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarFill key={s} width={12} height={12} className="text-[#f1b055]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#7a6c5d] line-clamp-4 leading-relaxed font-medium">
                      "{feedbackList[prevIdx]?.comment}"
                    </p>
                  </div>
                  {feedbackList[prevIdx]?.createdAt && (
                    <span className="text-[10px] font-semibold text-[#7a6c5d]/70 mt-2 block">
                      {formatDate(feedbackList[prevIdx]?.createdAt)}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Center Main Featured Review Card */}
              <div className="col-span-6 z-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={feedbackList[activeIdx]?._id || activeIdx}
                    initial={{ opacity: 0, scale: 0.94, x: 25 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.94, x: -25 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-3xl p-8 bg-white border-2 shadow-2xl flex flex-col justify-between min-h-[320px] relative overflow-hidden"
                    style={{ borderColor: "rgba(241, 176, 85, 0.55)" }}
                  >
                    {/* Top Progress Accent Indicator Line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#fdf6ea]">
                      {!isHovered && (
                        <motion.div
                          key={`progress-${activeIdx}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3.8, ease: "linear" }}
                          className="h-full bg-gradient-to-r from-[#f1b055] via-[#e59b38] to-[#f1b055]"
                        />
                      )}
                      {isHovered && (
                        <div className="h-full w-full bg-[#f1b055]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-4 mb-5 pt-2">
                        <div className="flex items-center gap-3.5">
                          <UserAvatar
                            name={feedbackList[activeIdx]?.name}
                            image={feedbackList[activeIdx]?.image || feedbackList[activeIdx]?.avatar || feedbackList[activeIdx]?.userImage}
                          />
                          <div>
                            <h3 className="font-black text-lg text-[#18020c]">
                              {feedbackList[activeIdx]?.name}
                            </h3>
                            <span
                              className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-[#fdf6ea] text-[#18020c] border border-[#f1b055]/30 mt-0.5"
                            >
                              {feedbackList[activeIdx]?.role || "Buyer"}
                            </span>
                          </div>
                        </div>

                        {/* 5 Star Rating */}
                        <div className="flex gap-1 bg-[#fdf6ea] px-3 py-1.5 rounded-full border border-[#f1b055]/25">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarFill
                              key={star}
                              width={16}
                              height={16}
                              style={{
                                color: star <= (feedbackList[activeIdx]?.rating || 5) ? "#f1b055" : "rgba(122, 108, 93, 0.25)",
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Comment Quote */}
                      <p className="text-base sm:text-lg font-medium leading-relaxed text-[#18020c] italic">
                        "{feedbackList[activeIdx]?.comment}"
                      </p>
                    </div>

                    {/* Small Date Stamp */}
                    {feedbackList[activeIdx]?.createdAt && (
                      <div className="mt-6 pt-3 border-t border-[#7a6c5d]/10 flex items-center justify-between text-xs text-[#7a6c5d] font-semibold">
                        <span>Verified Review</span>
                        <span>{formatDate(feedbackList[activeIdx]?.createdAt)}</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right/Next Review Card */}
              <motion.div
                key={`next-${nextIdx}`}
                initial={{ opacity: 0.4, scale: 0.85 }}
                animate={{ opacity: 0.65, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                onClick={() => setActiveIdx(nextIdx)}
                className="col-span-3 cursor-pointer"
              >
                <div
                  className="rounded-3xl p-6 bg-white border shadow-md flex flex-col justify-between h-[280px] hover:shadow-lg transition-shadow"
                  style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <UserAvatar
                        name={feedbackList[nextIdx]?.name}
                        image={feedbackList[nextIdx]?.image || feedbackList[nextIdx]?.avatar || feedbackList[nextIdx]?.userImage}
                      />
                      <div className="truncate">
                        <h4 className="font-bold text-sm text-[#18020c] truncate">
                          {feedbackList[nextIdx]?.name}
                        </h4>
                        <span className="text-xs font-semibold text-[#7a6c5d]">
                          {feedbackList[nextIdx]?.role || "Buyer"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarFill key={s} width={12} height={12} className="text-[#f1b055]" />
                      ))}
                    </div>
                    <p className="text-xs text-[#7a6c5d] line-clamp-4 leading-relaxed font-medium">
                      "{feedbackList[nextIdx]?.comment}"
                    </p>
                  </div>
                  {feedbackList[nextIdx]?.createdAt && (
                    <span className="text-[10px] font-semibold text-[#7a6c5d]/70 mt-2 block">
                      {formatDate(feedbackList[nextIdx]?.createdAt)}
                    </span>
                  )}
                </div>
              </motion.div>

            </div>

            {/* Mobile View: Single Focused Card */}
            <div className="block sm:hidden w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={feedbackList[activeIdx]?._id || activeIdx}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl p-6 bg-white border-2 shadow-xl flex flex-col justify-between relative overflow-hidden"
                  style={{ borderColor: "rgba(241, 176, 85, 0.5)" }}
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={feedbackList[activeIdx]?.name}
                        image={feedbackList[activeIdx]?.image || feedbackList[activeIdx]?.avatar || feedbackList[activeIdx]?.userImage}
                      />
                      <div>
                        <h3 className="font-bold text-base text-[#18020c]">
                          {feedbackList[activeIdx]?.name}
                        </h3>
                        <span className="text-xs font-semibold text-[#7a6c5d]">
                          {feedbackList[activeIdx]?.role || "Buyer"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarFill
                          key={star}
                          width={14}
                          height={14}
                          style={{
                            color: star <= (feedbackList[activeIdx]?.rating || 5) ? "#f1b055" : "rgba(122, 108, 93, 0.25)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-[#18020c] italic mb-4">
                    "{feedbackList[activeIdx]?.comment}"
                  </p>

                  {feedbackList[activeIdx]?.createdAt && (
                    <span className="text-[11px] font-semibold text-[#7a6c5d]">
                      {formatDate(feedbackList[activeIdx]?.createdAt)}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Animated Dot Indicators (No Arrows) */}
            <div className="mt-8 flex items-center justify-center gap-2.5">
              {feedbackList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Go to review ${idx + 1}`}
                  className="relative h-2.5 rounded-full overflow-hidden cursor-pointer transition-all duration-300"
                  style={{
                    width: activeIdx === idx ? "32px" : "10px",
                    backgroundColor: activeIdx === idx ? "#18020c" : "rgba(122, 108, 93, 0.25)",
                  }}
                >
                  {activeIdx === idx && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute inset-0 bg-[#f1b055] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}