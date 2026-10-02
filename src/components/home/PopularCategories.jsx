// components/home/PopularCategories.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Thunderbolt, House, Star, Car, Handset } from "@gravity-ui/icons";
import { getCategories } from "@/lib/api/products";

const CATEGORY_IMAGES = {
  "Mobile Phones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
  Electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  "Gaming & Consoles": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
  Vehicles: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80",
  Furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80",
};

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=800&auto=format&fit=crop&q=80";

const CATEGORY_ICONS = {
  Electronics: Thunderbolt,
  Furniture: House,
  Vehicles: Car,
  Fashion: Star,
  "Mobile Phones": Handset,
  "Gaming & Consoles": Thunderbolt,
};

function SkeletonTile() {
  return (
    <div
      className="h-64 sm:h-72 rounded-3xl animate-pulse bg-stone-200 border"
      style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
    />
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

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <span
            className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-3 border border-[#f1b055]/30 shadow-2xs"
            style={{ backgroundColor: "#fdf6ea", color: "#18020c" }}
          >
            Explore Marketplace
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: "#18020c" }}>
            Popular Categories
          </h2>
        </div>
        <p className="text-sm font-medium max-w-md" style={{ color: "#7a6c5d" }}>
          Find verified pre-owned items across our top trading categories with guaranteed buyer protection.
        </p>
      </div>

      {/* Grid of Visual Category Tiles */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTile key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const bgImage = CATEGORY_IMAGES[cat.name] || DEFAULT_CATEGORY_IMAGE;
            const Icon = CATEGORY_ICONS[cat.name] || Thunderbolt;

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => router.push(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden border cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
                style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
              >
                {/* Visual Category Background Image */}
                <img
                  src={bgImage}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Burgundy Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#18020c]/90 via-[#18020c]/40 to-transparent group-hover:from-[#18020c]/95 transition-opacity" />

                {/* Top Glassmorphic Icon Badge */}
                <div className="absolute top-5 right-5 z-10">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                    <Icon width={20} height={20} className="text-[#f1b055]" />
                  </div>
                </div>

                {/* Bottom Tile Info & Count */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end gap-2 text-white">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-[#f1b055] text-[#18020c] shadow-sm"
                    >
                      {cat.count} {cat.count === 1 ? "Listing" : "Listings"}
                    </span>
                    
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#f1b055] group-hover:text-[#18020c] transition-all duration-300">
                      <ArrowRight width={16} height={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-[#f1b055] transition-colors mt-1">
                    {cat.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}