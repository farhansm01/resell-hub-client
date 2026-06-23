// components/home/FeaturedProducts.jsx

"use client";

import { useEffect, useState } from "react";
import { Card, Chip, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "@gravity-ui/icons";
import Link from "next/link";

// Condition → Chip color mapping
const conditionColor = {
  "Like New": "success",
  "Good": "accent",
  "Fair": "warning",
  "Poor": "danger",
};

// Skeleton placeholder card
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "#FFFFFF", border: "1px solid #E7E5E4" }}>
      {/* Image placeholder */}
      <div className="w-full h-48" style={{ background: "#E7E5E4" }} />
      <div className="p-4 flex flex-col gap-3">
        {/* Title placeholder */}
        <div className="h-4 rounded-full w-3/4" style={{ background: "#E7E5E4" }} />
        {/* Badges placeholder */}
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full" style={{ background: "#E7E5E4" }} />
          <div className="h-5 w-16 rounded-full" style={{ background: "#E7E5E4" }} />
        </div>
        {/* Price placeholder */}
        <div className="h-6 w-24 rounded-full" style={{ background: "#E7E5E4" }} />
        {/* Button placeholder */}
        <div className="h-9 rounded-xl w-full" style={{ background: "#E7E5E4" }} />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest 6 approved products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products?limit=6&status=approved");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(data.products || data); // handle both { products: [] } and []
      } catch (err) {
        console.error("FeaturedProducts fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8" style={{ background: "#FAFAF9" }}>
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#F97316" }}>
              Fresh Listings
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#1C1917" }}>
              Featured Products
            </h2>
          </div>
          <Link href="/products">
            <Button
              variant="bordered"
              size="md"
              className="font-semibold"
              style={{ color: "#F97316", borderColor: "#F97316" }}
              endContent={<ArrowRight />}
            >
              View All
            </Button>
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? // Show 6 skeleton cards while loading
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                >
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300" style={{ border: "1px solid #E7E5E4" }}>

                    {/* Product image */}
                    <Card.Content className="p-0">
                      <div className="w-full h-48 overflow-hidden relative" style={{ background: "#FFF7ED" }}>
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          // Fallback if no image
                          <div className="w-full h-full flex items-center justify-center text-5xl">
                            📦
                          </div>
                        )}
                      </div>
                    </Card.Content>

                    {/* Card body */}
                    <Card.Content className="p-4 flex flex-col gap-3">

                      {/* Title */}
                      <Card.Title className="text-base font-bold line-clamp-1" style={{ color: "#1C1917" }}>
                        {product.title}
                      </Card.Title>

                      {/* Badges row */}
                      <div className="flex gap-2 flex-wrap">
                        {/* Category badge */}
                        <Chip size="sm" variant="soft" color="accent">
                          {product.category}
                        </Chip>
                        {/* Condition badge */}
                        <Chip
                          size="sm"
                          variant="soft"
                          color={conditionColor[product.condition] || "default"}
                        >
                          {product.condition}
                        </Chip>
                      </div>

                      {/* Price */}
                      <p className="text-xl font-extrabold" style={{ color: "#F97316" }}>
                        ৳{product.price?.toLocaleString()}
                      </p>

                      {/* View Details button */}
                      <Link href={`/products/${product._id}`} className="mt-auto">
                        <Button
                          size="sm"
                          className="w-full font-semibold text-white"
                          style={{ background: "#F97316" }}
                          startContent={<Eye />}
                        >
                          View Details
                        </Button>
                      </Link>
                    </Card.Content>

                  </Card>
                </motion.div>
              ))}
        </div>

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20" style={{ color: "#78716C" }}>
            <p className="text-lg">No products available right now. Check back soon!</p>
          </div>
        )}

      </div>
    </section>
  );
}