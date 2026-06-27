// components/home/PopularCategories.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Thunderbolt, House, Star, Car, Handset } from "@gravity-ui/icons";
import { getCategories } from "@/lib/api/products";

const CATEGORY_ICONS = {
  Electronics: Thunderbolt,
  Furniture: House,
  Vehicles: Car,
  Fashion: Star,
  "Mobile Phones": Handset,
};

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border animate-pulse p-6 flex flex-col items-center gap-3"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
    >
      <div className="h-14 w-14 rounded-full" style={{ backgroundColor: "#E7E5E4" }} />
      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#E7E5E4" }} />
      <div className="h-3 w-16 rounded" style={{ backgroundColor: "#E7E5E4" }} />
    </div>
  );
}

export default function PopularCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  }, []);

  // hide section entirely if no categories
  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto w-full">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold" style={{ color: "#1C1917" }}>
          Popular Categories
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#78716C" }}>
          Browse products by category
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.name] || Thunderbolt;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                onClick={() => router.push(`/categories/${encodeURIComponent(cat.name.toLowerCase())}`)}
                className="rounded-2xl border p-6 flex flex-col items-center gap-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#FFF7ED" }}
                >
                  <Icon width={28} height={28} style={{ color: "#F97316" }} />
                </div>
                <p className="text-sm font-semibold text-center" style={{ color: "#1C1917" }}>
                  {cat.name}
                </p>
                <p className="text-xs" style={{ color: "#78716C" }}>
                  {cat.count} {cat.count === 1 ? "Product" : "Products"}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}