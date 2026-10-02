// components/home/HeroSection.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Box,
  CreditCard,
  Tag,
  Magnifier,
  ChevronRight,
} from "@gravity-ui/icons";
import { useRouter } from "next/navigation";

const heroProducts = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro Titanium",
    specs: "256GB · Natural Titanium",
    price: "৳ 1,05,000",
    category: "Mobile Phones",
    image: "/prod_iphone.jpg",
  },
  {
    id: "macbook-air-m2",
    name: "MacBook Air M2 Space Gray",
    specs: "16GB RAM · 512GB SSD",
    price: "৳ 1,18,000",
    category: "Electronics",
    image: "/prod_macbook.jpg",
  },
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5 ANC",
    specs: "Active Noise Canceling · 30h",
    price: "৳ 28,500",
    category: "Electronics",
    image: "/prod_headphones.jpg",
  },
  {
    id: "sony-camera",
    name: "Sony Alpha A7 IV Camera",
    specs: "33MP · 4K 60p · 24-70mm Lens",
    price: "৳ 1,95,000",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "yamaha-r15-v4",
    name: "Yamaha R15 V4 Racing Blue",
    specs: "Full Papers · 8,500 KM",
    price: "৳ 3,85,000",
    category: "Vehicles",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80",
  }
];

export default function HeroSection() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth Infinite Slideshow Interval (every 3.5 seconds)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    router.push(`/products?${params.toString()}`);
  };

  const currentProduct = heroProducts[currentIndex];

  const featurePills = [
    { icon: ShieldCheck, title: "Verified Sellers" },
    { icon: Box, title: "Inspected Products" },
    { icon: CreditCard, title: "Secure Payments" },
    { icon: ShieldCheck, title: "Buyer Protection" },
  ];

  return (
    <section
      className="relative w-full overflow-hidden border-b selection:bg-[#f1b055] selection:text-[#18020c]"
      style={{ backgroundColor: "#ffffff", borderColor: "rgba(122, 108, 93, 0.15)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* ── LEFT SIDE: Typography, Feature Pills, Search Capsule ── */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left z-10">

            {/* Top Pill Tag */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-[#7a6c5d]/30 text-[#7a6c5d] bg-white shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#f1b055] animate-pulse" />
                <span>PRE-LOVED. RE-ENGINEERED.</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]" style={{ color: "#18020c" }}>
                Buy Better.
              </h1>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] bg-clip-text text-transparent bg-gradient-to-r from-[#f1b055] via-[#e59b38] to-[#d68b25]">
                Sell Smarter.
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-xl" style={{ color: "#7a6c5d" }}>
              Quality pre-owned products. Trusted sellers. Better value.
            </p>

            {/* 4 Feature Pills Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2 max-w-2xl">
              {featurePills.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border transition-all"
                  style={{ backgroundColor: "#fdf6ea", borderColor: "rgba(241, 176, 85, 0.4)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(241, 176, 85, 0.25)" }}
                  >
                    <feature.icon className="w-4 h-4 text-[#18020c]" />
                  </div>
                  <span className="text-xs font-bold leading-tight" style={{ color: "#18020c" }}>
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Search Capsule Bar */}
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row items-center p-2 rounded-2xl sm:rounded-full bg-white border shadow-md max-w-2xl w-full gap-2 transition-all focus-within:border-[#f1b055]"
              style={{ borderColor: "rgba(122, 108, 93, 0.3)" }}
            >
              {/* Category Dropdown */}
              <div className="w-full sm:w-auto px-4 py-2 border-b sm:border-b-0 sm:border-r border-[#7a6c5d]/20 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#f1b055] shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-32 bg-transparent text-sm font-bold text-[#18020c] outline-none cursor-pointer"
                >
                  <option value="all">All Products</option>
                  <option value="Mobile Phones">Mobile Phones</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Gaming & Consoles">Gaming & Consoles</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>

              {/* Keyword Input */}
              <div className="flex-1 w-full px-3 py-2 flex items-center gap-2">
                <Magnifier className="w-5 h-5 text-[#7a6c5d] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for phones, laptops, cameras, vehicles..."
                  className="w-full bg-transparent text-sm text-[#18020c] outline-none placeholder:text-[#7a6c5d]"
                />
              </div>

              {/* Explore Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full font-bold text-sm text-[#18020c] flex items-center justify-center gap-2 transition hover:opacity-90 shrink-0 cursor-pointer"
                style={{ backgroundColor: "#f1b055" }}
              >
                <span>Explore</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* ── RIGHT SIDE: Minimal Product Showcase (Clean Rounded Image Cards & Infinite Loop) ── */}
          <div
            className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[440px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Clean Rounded Image Frame Stage */}
            <div className="relative w-full max-w-lg h-[360px] sm:h-[390px] rounded-3xl overflow-hidden border shadow-xl bg-white p-3 flex flex-col items-center justify-center" style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#faf9f6]"
                >
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover rounded-2xl select-none"
                  />
                  {/* Overlay gradient for contrast on text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18020c]/85 via-transparent to-transparent rounded-2xl pointer-events-none" />

                  {/* Product Details Pill inside Image Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                    <div className="flex flex-col text-white">
                      <span className="text-xs font-bold text-[#f1b055] uppercase tracking-wider">
                        {currentProduct.category}
                      </span>
                      <h3 className="text-base font-bold text-white truncate max-w-[220px]">
                        {currentProduct.name}
                      </h3>
                    </div>
                    <span className="text-sm font-black px-3.5 py-1.5 rounded-full bg-[#f1b055] text-[#18020c] shadow-md shrink-0">
                      {currentProduct.price}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sleek Infinite Loop Indicator Dots */}
            <div className="relative z-20 mt-4 flex items-center justify-center gap-2">
              {heroProducts.map((prod, i) => (
                <button
                  key={prod.id}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="h-2 rounded-full transition-all cursor-pointer"
                  style={{
                    width: currentIndex === i ? "28px" : "8px",
                    backgroundColor: currentIndex === i ? "#f1b055" : "rgba(122, 108, 93, 0.3)",
                  }}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}