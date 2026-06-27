// components/products/ProductCard.jsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// condition badge color
const conditionColor = (condition) => {
  if (condition === "Like New") return "#16A34A";
  if (condition === "Good") return "#CA8A04";
  return "#78716C";
};

export default function ProductCard({ product, index = 0 }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}
      onClick={() => router.push(`/products/${product._id}`)}
    >
      {/* Image */}
      <div className="w-full h-48 overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Body */}
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

        {/* Button */}
        <button
          onClick={(e) => { e.stopPropagation(); router.push(`/products/${product._id}`); }}
          className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#F97316" }}
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}