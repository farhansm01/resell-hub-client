// components/home/FeaturedProducts.jsx

"use client";

import { useEffect, useState } from "react";
import { Card, Chip, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "@gravity-ui/icons";
import Link from "next/link";

// Condition → color mapping for Chip
const conditionColor = {
  "Like New": "success",
  "Good": "primary",
  "Fair": "warning",
  "Poor": "danger",
};

// Mock fallback data — used when backend is not ready
const MOCK_PRODUCTS = [
  { _id: "1", title: "Sony WH-1000XM4 Headphones", category: "Electronics", condition: "Like New", price: 4500, images: [] },
  { _id: "2", title: "IKEA Study Desk", category: "Furniture", condition: "Good", price: 3200, images: [] },
  { _id: "3", title: "iPhone 13 Pro", category: "Mobile Phones", condition: "Like New", price: 52000, images: [] },
  { _id: "4", title: "Honda CB150R", category: "Vehicles", condition: "Good", price: 185000, images: [] },
  { _id: "5", title: "Nike Air Max 270", category: "Fashion", condition: "Fair", price: 2800, images: [] },
  { _id: "6", title: "Canon EOS M50", category: "Electronics", condition: "Like New", price: 38000, images: [] },
];

// Category emoji fallback map
const categoryEmoji = {
  Electronics: "💻",
  Furniture: "🪑",
  Vehicles: "🏍️",
  Fashion: "👟",
  "Mobile Phones": "📱",
};

// Skeleton placeholder card
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: "#FFFFFF", border: "1px solid #E7E5E4" }}
    >
      {/* Image placeholder */}
      <div className="w-full h-48" style={{ background: "#E7E5E4" }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 rounded-full w-3/4" style={{ background: "#E7E5E4" }} />
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full" style={{ background: "#E7E5E4" }} />
          <div className="h-5 w-16 rounded-full" style={{ background: "#E7E5E4" }} />
        </div>
        <div className="h-6 w-24 rounded-full" style={{ background: "#E7E5E4" }} />
        <div className="h-9 rounded-xl w-full" style={{ background: "#E7E5E4" }} />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products?limit=6&status=approved");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const fetched = data.products || data;
        // Fall back to mock if empty
        setProducts(fetched.length > 0 ? fetched : MOCK_PRODUCTS);
      } catch (err) {
        // Backend not ready — use mock data silently
        console.warn("Using mock products:", err.message);
        setProducts(MOCK_PRODUCTS);
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
            <Button
              variant="bordered"
              size="md"
              className="font-semibold rounded-full hover:bg-orange-50 transition-colors duration-200"
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
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="h-full"
                >
                  <Card
                    className="overflow-hidden h-full hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    style={{ border: "1px solid #E7E5E4", background: "#FFFFFF" }}
                  >
                    {/* Product image — plain div, outside Card subcomponents */}
                    <div
                      className="w-full h-48 overflow-hidden"
                      style={{ background: "#FFF7ED" }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        // Emoji fallback by category
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          {categoryEmoji[product.category] || "📦"}
                        </div>
                      )}
                    </div>

                    {/* Card header — title */}
                    <Card.Header className="pb-0">
                      <Card.Title
                        className="text-base font-bold line-clamp-1"
                        style={{ color: "#1C1917" }}
                      >
                        {product.title}
                      </Card.Title>
                    </Card.Header>

                    {/* Card content — badges, price, button */}
                    <Card.Content className="flex flex-col gap-3 pt-2">

                      {/* Badges */}
                      <div className="flex gap-2 flex-wrap">
                        <Chip size="sm" variant="soft">
                          {product.category}
                        </Chip>
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
                      <Link href={`/products/${product._id}`}>
                        <Button
                          size="sm"
                          className="w-full font-semibold text-white rounded-full hover:opacity-90 transition-opacity duration-200"
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

      </div>
    </section>
  );
}