// app/(main)/categories/[name]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft } from "@gravity-ui/icons";
import { getProducts } from "@/lib/api/products";
import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

export default function CategoryProductsPage() {
  const { name } = useParams();
  const router = useRouter();

  // decode and capitalize for display e.g. "mobile phones" → "Mobile Phones"
  const decoded = decodeURIComponent(name);
  const displayName = decoded
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ category: displayName });
        setProducts(data.products || []);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [displayName]);

  return (
    <div className="min-h-screen px-4 py-10 max-w-7xl mx-auto" style={{ backgroundColor: "#FAFAF9" }}>

      {/* Back button + heading */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/categories")}
          className="flex items-center gap-2 text-sm font-medium mb-4 transition-opacity hover:opacity-70"
          style={{ color: "#78716C" }}
        >
          <ArrowLeft width={16} height={16} />
          All Categories
        </button>

        <h1 className="text-3xl font-bold" style={{ color: "#1C1917" }}>{displayName}</h1>
        <p className="text-sm mt-1" style={{ color: "#78716C" }}>
          {isLoading ? "Loading..." : `${products.length} ${products.length === 1 ? "Product" : "Products"} found`}
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2">
          <p className="text-lg font-medium" style={{ color: "#1C1917" }}>No products in this category yet</p>
          <p className="text-sm" style={{ color: "#78716C" }}>Check back later or browse other categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}