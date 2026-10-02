// components/home/TrustedSellers.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StarFill, ShieldCheck, Sparkles, Box } from "@gravity-ui/icons";
import { getTopSellers } from "@/lib/api/users";

const SELLER_TAGS = ["Verified Seller", "Top Rated", "Community Seller", "Super Seller"];

function SkeletonCard() {
  return (
    <div
      className="rounded-3xl border animate-pulse p-6 flex flex-col items-center gap-4 bg-white"
      style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
    >
      <div className="h-20 w-20 rounded-full bg-stone-200" />
      <div className="h-5 w-32 rounded bg-stone-200" />
      <div className="h-4 w-24 rounded bg-stone-100" />
    </div>
  );
}

export default function TrustedSellers() {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTopSellers()
      .then(setSellers)
      .catch(() => setSellers([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && sellers.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Heading */}
      <div className="mb-14 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#f1b055]/50 text-[#18020c] bg-[#fdf6ea] shadow-2xs mb-3">
          <Sparkles width={14} height={14} className="text-[#f1b055]" />
          <span>TOP COMMUNITY MEMBERS</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: "#18020c" }}>
          Trusted Sellers
        </h2>
        <p className="mt-2 text-sm sm:text-base font-medium" style={{ color: "#7a6c5d" }}>
          Meet our highest-rated marketplace sellers.
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sellers.map((seller, i) => {
            const rawImage =
              seller.image ||
              seller.photoURL ||
              seller.avatar ||
              seller.sellerImage ||
              seller.userImage ||
              seller.photo ||
              seller.picture;

            const nameFallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              seller.sellerName || "Seller"
            )}&background=f1b055&color=18020c&bold=true&size=256`;

            const avatarSrc = rawImage || nameFallbackUrl;
            const badgeTag = SELLER_TAGS[i % SELLER_TAGS.length];

            return (
              <motion.div
                key={seller._id || seller.sellerEmail || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group rounded-3xl bg-white border shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
              >
                {/* Top Card Banner Accent */}
                <div className="relative h-24 bg-gradient-to-r from-[#18020c] via-[#2d091a] to-[#18020c] p-4 flex items-start justify-end">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f1b055] text-[#18020c] shadow-xs">
                    <ShieldCheck width={12} height={12} />
                    {badgeTag}
                  </span>
                </div>

                {/* Avatar & Content Container */}
                <div className="px-6 pb-8 pt-0 flex flex-col items-center text-center -mt-12">
                  {/* Photo Avatar with Name-based Fallback & onError handling */}
                  <div className="relative mb-3">
                    <div className="w-22 h-22 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#fdf6ea] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <img
                        src={avatarSrc}
                        alt={seller.sellerName || "Seller"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = nameFallbackUrl;
                        }}
                      />
                    </div>
                    {/* Small Verified Checkmark Badge */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#f1b055] text-[#18020c] flex items-center justify-center border-2 border-white shadow-xs">
                      <ShieldCheck width={14} height={14} />
                    </div>
                  </div>

                  {/* Seller Name */}
                  <h3 className="text-xl font-black text-[#18020c] group-hover:text-[#f1b055] transition-colors mb-1">
                    {seller.sellerName}
                  </h3>

                  {/* Listings Count Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#7a6c5d] bg-[#fdf6ea] border border-[#f1b055]/30 mb-4">
                    <Box width={13} height={13} className="text-[#f1b055]" />
                    <span>
                      {seller.totalListings} {seller.totalListings === 1 ? "Listing" : "Listings"}
                    </span>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[#f1b055]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarFill key={s} width={16} height={16} />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}