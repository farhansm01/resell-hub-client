// components/home/FeaturedProducts.jsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "@gravity-ui/icons";
import { getProducts } from "@/lib/api/products";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

export default function FeaturedProducts() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts({ limit: 10 });
        setProducts(data.products || []);
      } catch (err) {
        console.warn("Failed to load featured products:", err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (!loading && products.length === 0) return null;

  // Duplicate fetched items so the horizontal marquee loop is completely seamless
  const marqueeItems = [...products, ...products, ...products];

  return (
    <section className="w-full py-16 overflow-hidden select-none" style={{ background: "#ffffff" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p
            className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-1"
            style={{ color: "#f1b055" }}
          >
            Fresh Listings
          </p>
          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight"
            style={{ color: "#18020c" }}
          >
            Featured Products
          </h2>
        </div>
        <Link href="/products">
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border transition-all duration-200 hover:bg-[#f1b055]/10 cursor-pointer"
            style={{ color: "#18020c", borderColor: "rgba(122, 108, 93, 0.3)" }}
          >
            <span>Explore All</span>
            <ArrowRight width={16} height={16} className="text-[#f1b055]" />
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        /* Infinite Marquee Track Container */
        <div
          className="relative w-full overflow-hidden py-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Edge Masks for Smooth Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Continuous Motion Track */}
          <motion.div
            className="flex gap-6 w-max"
            animate={isPaused ? { x: undefined } : { x: ["0%", "-33.333%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35,
                ease: "linear",
              },
            }}
          >
            {marqueeItems.map((product, idx) => (
              <motion.div
                key={`${product._id}-${idx}`}
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ duration: 0.25 }}
                onClick={() => router.push(`/products/${product._id}`)}
                className="relative shrink-0 w-[270px] sm:w-[310px] h-[360px] rounded-3xl overflow-hidden border shadow-md hover:shadow-2xl transition-all cursor-pointer group bg-white"
                style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
              >
                {/* Large Image Container */}
                <div className="w-full h-full relative overflow-hidden bg-[#faf9f6]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18020c]/90 via-[#18020c]/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                </div>

                {/* Top Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-white/90 backdrop-blur-md shadow-sm"
                    style={{ color: "#18020c" }}
                  >
                    {product.category || "General"}
                  </span>
                </div>

                {/* Bottom Minimal Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col gap-1.5 text-white">
                  <h3 className="font-bold text-base line-clamp-1 group-hover:text-[#f1b055] transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xl font-black text-[#f1b055]">
                      ৳{product.price?.toLocaleString()}
                    </p>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md"
                    >
                      {product.condition || "Used"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}