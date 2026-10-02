// components/home/MarketplaceStats.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { LayoutCellsLarge, Person, ShoppingCart, ChartLine } from "@gravity-ui/icons";
import { getStats } from "@/lib/api/products";

function useCounter(target, isInView) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    if (!isInView || target === 0) return;
    const controls = animate(count, target, { duration: 1.8, ease: "easeOut" });
    return controls.stop;
  }, [isInView, target]);

  return rounded;
}

function StatItem({ label, value, icon: Icon, isInView, borderStyle }) {
  const count = useCounter(value, isInView);

  return (
    <div className={`flex flex-col items-center justify-center p-6 sm:p-8 text-center ${borderStyle}`}>
      <div className="inline-flex items-center justify-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs"
          style={{ backgroundColor: "rgba(241, 176, 85, 0.25)" }}
        >
          <Icon className="w-4 h-4 text-[#18020c]" />
        </div>
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#7a6c5d]">
          {label}
        </span>
      </div>

      <motion.p className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#f1b055] tracking-tight">
        {value === 0 ? "0" : count}
      </motion.p>
    </div>
  );
}

function SkeletonStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#7a6c5d]/15">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 flex flex-col items-center justify-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-amber-200/50" />
          <div className="h-8 w-20 rounded bg-amber-200/50" />
          <div className="h-4 w-24 rounded bg-amber-200/30" />
        </div>
      ))}
    </div>
  );
}

export default function MarketplaceStats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setIsLoading(false));
  }, []);

  const STAT_ITEMS = [
    { label: "Total Products", key: "totalProducts", icon: LayoutCellsLarge },
    { label: "Total Sellers", key: "totalSellers", icon: Person },
    { label: "Total Buyers", key: "totalBuyers", icon: ShoppingCart },
    { label: "Completed Orders", key: "totalOrders", icon: ChartLine },
  ];

  const BORDER_STYLES = [
    "border-r border-b md:border-b-0 border-[#7a6c5d]/15",
    "border-b md:border-b-0 md:border-r border-[#7a6c5d]/15",
    "border-r md:border-r border-[#7a6c5d]/15",
    "",
  ];

  return (
    <section
      ref={ref}
      className="py-16 px-4 sm:px-6 lg:px-8 w-full border-t border-b select-none"
      style={{ backgroundColor: "#ffffff", borderColor: "rgba(122, 108, 93, 0.15)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: "#18020c" }}>
            Marketplace at a Glance
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium" style={{ color: "#7a6c5d" }}>
            Growing every day, one transaction at a time.
          </p>
        </div>

        {/* Elegant Horizontal Statistics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-3xl border shadow-sm overflow-hidden"
          style={{ backgroundColor: "#fdf6ea", borderColor: "rgba(241, 176, 85, 0.35)" }}
        >
          {isLoading ? (
            <SkeletonStrip />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4">
              {STAT_ITEMS.map(({ label, key, icon }, i) => (
                <StatItem
                  key={key}
                  label={label}
                  value={stats?.[key] ?? 0}
                  icon={icon}
                  isInView={isInView}
                  borderStyle={BORDER_STYLES[i]}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}