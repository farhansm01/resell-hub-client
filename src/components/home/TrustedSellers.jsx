// components/home/TrustedSellers.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "@gravity-ui/icons";
import { getTopSellers } from "@/lib/api/users";

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border animate-pulse p-6 flex flex-col items-center gap-3"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
    >
      <div className="h-16 w-16 rounded-full" style={{ backgroundColor: "#E7E5E4" }} />
      <div className="h-4 w-28 rounded" style={{ backgroundColor: "#E7E5E4" }} />
      <div className="h-3 w-20 rounded" style={{ backgroundColor: "#E7E5E4" }} />
      <div className="h-3 w-24 rounded" style={{ backgroundColor: "#E7E5E4" }} />
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

  // hide section entirely if no sellers
  if (!isLoading && sellers.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto w-full">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold" style={{ color: "#1C1917" }}>
          Trusted Sellers
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#78716C" }}>
          Meet our top-rated marketplace sellers
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller, i) => (
            <motion.div
              key={seller._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="rounded-2xl border p-6 flex flex-col items-center gap-3 text-center"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
            >
              {/* Avatar — initials circle */}
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                style={{ backgroundColor: "#F97316" }}
              >
                {seller.sellerName?.charAt(0).toUpperCase() || "S"}
              </div>

              {/* Name */}
              <p className="text-base font-semibold" style={{ color: "#1C1917" }}>
                {seller.sellerName}
              </p>

              {/* Listings count */}
              <p className="text-sm" style={{ color: "#78716C" }}>
                {seller.totalListings} {seller.totalListings === 1 ? "Listing" : "Listings"}
              </p>

              {/* Static 5 star rating */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} width={16} height={16} style={{ color: "#F97316" }} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}