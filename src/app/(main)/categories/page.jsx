// app/(main)/categories/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Thunderbolt, House, Star, Car, Handset,
} from "@gravity-ui/icons";
import { getCategories } from "@/lib/api/products";

// icon map per category name
const CATEGORY_ICONS = {
  Electronics: Thunderbolt,
  Furniture: House,
  Vehicles: Car,
  Fashion: Star,
  "Mobile Phones": Handset,
};

// skeleton card for loading
function SkeletonCategoryCard() {
  return (
    <div
      className="rounded-2xl border animate-pulse p-6 flex flex-col items-center gap-3"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
    >
      <div className="h-12 w-12 rounded-full" style={{ backgroundColor: "#E7E5E4" }} />
      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#E7E5E4" }} />
      <div className="h-3 w-16 rounded" style={{ backgroundColor: "#E7E5E4" }} />
    </div>
  );
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen px-4 py-10 max-w-7xl mx-auto" style={{ backgroundColor: "#FAFAF9" }}>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "#1C1917" }}>Browse by Category</h1>
        <p className="text-sm mt-1" style={{ color: "#78716C" }}>Find what you're looking for</p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCategoryCard key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-lg font-medium" style={{ color: "#1C1917" }}>No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.name] || Thunderbolt;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                onClick={() => router.push(`/categories/${encodeURIComponent(cat.name.toLowerCase())}`)}
                className="rounded-2xl border p-6 flex flex-col items-center gap-3 cursor-pointer transition-shadow hover:shadow-md"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
              >
                {/* Icon bubble */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#FFF7ED" }}
                >
                  <Icon width={28} height={28} style={{ color: "#F97316" }} />
                </div>

                {/* Name */}
                <p className="text-sm font-semibold text-center" style={{ color: "#1C1917" }}>
                  {cat.name}
                </p>

                {/* Count */}
                <p className="text-xs" style={{ color: "#78716C" }}>
                  {cat.count} {cat.count === 1 ? "Product" : "Products"}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}