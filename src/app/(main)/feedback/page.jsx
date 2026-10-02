// app/(main)/feedback/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StarFill, Comments, Lock } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { submitFeedback } from "@/lib/api/feedback";

export default function FeedbackPage() {
  const { data: session, isPending } = useSession();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("You must be logged in to submit feedback.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter your feedback comment.");
      return;
    }

    // Auto-detect role from logged in user session
    const userRole = session.user.role === "seller" ? "Seller" : "Buyer";

    try {
      setSubmitting(true);
      await submitFeedback({
        name: session.user.name || "User",
        email: session.user.email || "",
        role: userRole,
        rating,
        comment: comment.trim(),
        image: session.user.image || session.user.avatar || "",
      });

      toast.success("Thank you! Your feedback has been submitted for moderation.");
      setComment("");
    } catch (err) {
      toast.error(err.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const RATING_LABELS = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 selection:bg-[#f1b055] selection:text-[#18020c]" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#f1b055]/40 text-[#18020c] bg-[#fdf6ea] mb-4">
            <Comments width={14} height={14} className="text-[#f1b055]" />
            <span>Community Feedback</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: "#18020c" }}>
            Share Your Experience
          </h1>
          <p className="mt-3 text-base sm:text-lg font-medium max-w-xl mx-auto" style={{ color: "#7a6c5d" }}>
            Help us shape the future of ReSellHub. Your feedback is reviewed by our team and featured in Community Voices.
          </p>
        </div>

        {/* Require Authentication Check */}
        {isPending ? (
          <div className="rounded-3xl border p-12 text-center bg-white shadow-sm animate-pulse" style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}>
            <div className="h-6 w-48 bg-stone-200 rounded mx-auto mb-4" />
            <div className="h-4 w-64 bg-stone-200 rounded mx-auto" />
          </div>
        ) : !session?.user ? (
          /* Log In Required Card */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border p-8 sm:p-12 text-center bg-white shadow-xl relative overflow-hidden"
            style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
          >
            <div className="w-16 h-16 rounded-full bg-[#fdf6ea] border border-[#f1b055]/40 flex items-center justify-center mx-auto mb-5 text-[#18020c]">
              <Lock width={28} height={28} className="text-[#f1b055]" />
            </div>

            <h3 className="text-2xl font-black text-[#18020c]">
              Sign In to Share Feedback
            </h3>

            <p className="mt-2 text-sm font-medium text-[#7a6c5d] max-w-md mx-auto">
              Only verified members of the ReSellHub community can submit feedback. Please sign in to your account to share your thoughts.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signin?callbackUrl=/feedback">
                <button
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-black text-sm text-[#18020c] transition hover:opacity-90 cursor-pointer shadow-md"
                  style={{ backgroundColor: "#f1b055" }}
                >
                  Sign In to Continue
                </button>
              </Link>
              
              <Link href="/signup">
                <button
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm text-[#18020c] border transition hover:bg-stone-50 cursor-pointer"
                  style={{ borderColor: "rgba(122, 108, 93, 0.3)" }}
                >
                  Create an Account
                </button>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Feedback Form Card for Logged In Users */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border p-6 sm:p-10 shadow-xl bg-white relative overflow-hidden"
            style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
          >
            {/* Logged In User Verified Info Bar */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fdf6ea] border border-[#f1b055]/35 mb-6">
              <div className="flex items-center gap-3">
                {session.user.image || session.user.avatar ? (
                  <img
                    src={session.user.image || session.user.avatar}
                    alt={session.user.name || "User"}
                    className="w-10 h-10 rounded-full object-cover border border-[#f1b055]/40 shadow-xs"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#18020c] text-[#f1b055] font-black flex items-center justify-center text-sm shadow-xs">
                    {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm text-[#18020c]">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-[#7a6c5d]">
                    {session.user.email}
                  </p>
                </div>
              </div>

              {/* Automatically Verified Role Badge */}
              <span className="text-xs font-black uppercase px-3.5 py-1 rounded-full bg-[#18020c] text-[#f1b055] shadow-xs">
                Verified {session.user.role === "seller" ? "Seller" : "Buyer"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Rating Stars Selection */}
              <div className="flex flex-col items-center justify-center py-5 bg-[#fdf6ea] rounded-2xl border border-[#f1b055]/30">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7a6c5d] mb-2">
                  Overall Rating
                </span>
                
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <StarFill
                        width={32}
                        height={32}
                        style={{
                          color: (hoverRating || rating) >= star ? "#f1b055" : "rgba(122, 108, 93, 0.25)",
                        }}
                      />
                    </button>
                  ))}
                </div>

                <span className="text-sm font-bold mt-2" style={{ color: "#18020c" }}>
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              </div>

              {/* Feedback Comment Area */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#18020c" }}>
                  Your Feedback / Testimonial <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience buying or selling products on ReSellHub..."
                  className="w-full px-4 py-3 rounded-xl border text-sm text-[#18020c] outline-none transition focus:border-[#f1b055] resize-none"
                  style={{ borderColor: "rgba(122, 108, 93, 0.3)" }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-black text-sm text-[#18020c] transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-md"
                style={{ backgroundColor: "#f1b055" }}
              >
                {submitting ? "Submitting Feedback..." : "Submit Feedback"}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
