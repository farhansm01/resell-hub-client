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

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts({ limit: 6 });
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

  // condition badge color — same logic as products/page.js
  const conditionColor = (condition) => {
    if (condition === "Like New") return "#16A34A";
    if (condition === "Good") return "#CA8A04";
    return "#78716C";
  };

  // No data and not loading -> don't render the section at all
  if (!loading && products.length === 0) return null;

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8" style={{ background: "#FAFAF9" }}>
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#F97316" }}
            >
              Fresh Listings
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ color: "#1C1917" }}
            >
              Featured Products
            </h2>
          </div>
          <Link href="/products">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border transition-colors duration-200 hover:bg-orange-50"
              style={{ color: "#F97316", borderColor: "#F97316" }}
            >
              View All
              <ArrowRight width={16} height={16} />
            </button>
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}
                  onClick={() => router.push(`/products/${product._id}`)}
                >
                  {/* Product image */}
                  <div className="w-full h-48 overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Card body */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm line-clamp-2" style={{ color: "#1C1917" }}>
                      {product.title}
                    </h3>

                    {/* Badges */}
                    <div className="flex gap-2 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "#FFF7ED", color: "#F97316" }}
                      >
                        {product.category}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "#F0FDF4", color: conditionColor(product.condition) }}
                      >
                        {product.condition}
                      </span>
                    </div>

                    {/* Price */}
                    <p className="text-lg font-bold" style={{ color: "#F97316" }}>
                      ৳{product.price.toLocaleString()}
                    </p>

                    {/* View Details button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // avoid double-navigation since card itself is clickable
                        router.push(`/products/${product._id}`);
                      }}
                      className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#F97316" }}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
        </div>

      </div>
    </section>
  );
}