// components/home/HeroSection.jsx
"use client";

import { Button } from "@heroui/react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight } from "@gravity-ui/icons";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const fadeSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
  }),
};

const stats = [
  { label: "Products Listed", value: 12000, suffix: "+" },
  { label: "Active Sellers", value: 3500, suffix: "+" },
  { label: "Happy Buyers", value: 8200, suffix: "+" },
];

function AnimatedCounter({ value, suffix }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
      });
    }
  }, [isInView, motionValue, value]);

  const display = useTransform(motionValue, (v) => {
    if (value >= 1000) {
      return (v / 1000).toFixed(1).replace(/\.0$/, "") + "K" + suffix;
    }
    return Math.round(v) + suffix;
  });

  return (
    <span ref={ref} className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#F97316" }}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

export default function HeroSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  // role-based redirect for Start Selling
  const startSellingHref = role === "seller"
    ? "/dashboard/seller/add-product"
    : role === "buyer" || role === "admin"
    ? "/dashboard"
    : "/signup";

  return (
    <section
      className="relative w-full min-h-[90vh] flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FAFAF9 60%, #FFF7ED 100%)" }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#F97316" }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#3B5BDB" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text content */}
          <div className="flex flex-col gap-6">

            {/* Badge */}
            <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" custom={0}>
              <span
                className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full"
                style={{ background: "#FFF7ED", color: "#C2410C", border: "1px solid #F97316" }}
              >
                🛍️ Bangladesh&apos;s Trusted Second-Hand Marketplace
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeSlideUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
              style={{ color: "#1C1917" }}
            >
              Buy & Sell{" "}
              <span style={{ color: "#F97316" }}>Pre-Loved</span>{" "}
              Items with Confidence
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeSlideUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg sm:text-xl max-w-lg"
              style={{ color: "#78716C" }}
            >
              Discover thousands of second-hand products at unbeatable prices.
              Give items a second life — good for your wallet, great for the planet.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeSlideUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products">
                <Button
                  size="lg"
                  className="font-semibold text-white py-2 px-8 rounded-full hover:opacity-90 transition-opacity duration-200"
                  style={{ background: "#F97316" }}
                  endContent={<ArrowRight />}
                >
                  Browse Products
                </Button>
              </Link>

              {/* Start Selling — role-based redirect */}
              <Button
                size="lg"
                variant="bordered"
                className="font-semibold py-2 px-8 rounded-full hover:bg-orange-50 transition-colors duration-200"
                style={{ color: "#F97316", borderColor: "#F97316" }}
                onPress={() => router.push(startSellingHref)}
              >
                Start Selling
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeSlideUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="w-full mt-2 rounded-2xl overflow-hidden"
              style={{ border: "1px solid #E7E5E4", background: "#FFFFFF" }}
            >
              <div className="grid grid-cols-3 w-full">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center py-5 px-4"
                    style={{
                      borderRight: i < stats.length - 1 ? "1px solid #E7E5E4" : "none",
                    }}
                  >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    <span className="text-xs sm:text-sm font-medium mt-1 text-center" style={{ color: "#78716C" }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Visual card mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:flex justify-center items-center"
          >
            <div
              className="relative w-full max-w-md rounded-3xl p-6 shadow-2xl"
              style={{ background: "#FFFFFF", border: "1px solid #E7E5E4" }}
            >
              <div className="flex flex-col gap-4">
                <div
                  className="w-full h-48 rounded-2xl flex items-center justify-center text-6xl"
                  style={{ background: "#FFF7ED" }}
                >
                  📦
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg" style={{ color: "#1C1917" }}>
                      Sony WH-1000XM4
                    </p>
                    <p className="text-sm" style={{ color: "#78716C" }}>
                      Electronics · Like New
                    </p>
                  </div>
                  <span className="text-xl font-extrabold" style={{ color: "#F97316" }}>
                    ৳4,500
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["Electronics", "Like New", "Verified"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: "#FFF7ED", color: "#C2410C" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  className="w-full text-center py-2.5 rounded-full font-semibold text-white text-sm cursor-pointer"
                  style={{ background: "#F97316" }}
                >
                  View Details
                </div>
              </div>

              <div
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                style={{ background: "#16A34A" }}
              >
                ✓ Verified Seller
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}