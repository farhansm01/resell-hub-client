// components/home/MarketplaceStats.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { LayoutCellsLarge, Person, ShoppingCart, ChartLine } from "@gravity-ui/icons";
import { getStats } from "@/lib/api/products";

// animated number counter hook
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

function StatCard({ label, value, icon: Icon, color, isInView }) {
  const count = useCounter(value, isInView);

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-sm"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full mb-4"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Icon width={26} height={26} style={{ color }} />
      </div>
      <motion.p className="text-4xl font-extrabold mb-2" style={{ color: "#F97316" }}>
        {value === 0 ? "0" : count}
      </motion.p>
      <p className="text-sm font-medium" style={{ color: "#78716C" }}>{label}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border animate-pulse p-8 flex flex-col items-center gap-3"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
    >
      <div className="h-14 w-14 rounded-full" style={{ backgroundColor: "#E7E5E4" }} />
      <div className="h-8 w-20 rounded" style={{ backgroundColor: "#E7E5E4" }} />
      <div className="h-4 w-28 rounded" style={{ backgroundColor: "#E7E5E4" }} />
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

  const STAT_CARDS = [
    { label: "Total Products", key: "totalProducts", icon: LayoutCellsLarge, color: "#F97316" },
    { label: "Total Sellers", key: "totalSellers", icon: Person, color: "#3B5BDB" },
    { label: "Total Buyers", key: "totalBuyers", icon: ShoppingCart, color: "#16A34A" },
    { label: "Completed Orders", key: "totalOrders", icon: ChartLine, color: "#CA8A04" },
  ];

  return (
    <section
      ref={ref}
      className="py-16 px-4 w-full"
      style={{ backgroundColor: "#F5F5F4" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold" style={{ color: "#1C1917" }}>
            Marketplace at a Glance
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#78716C" }}>
            Numbers that speak for themselves
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map(({ label, key, icon, color }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
              >
                <StatCard
                  label={label}
                  value={stats?.[key] ?? 0}
                  icon={icon}
                  color={color}
                  isInView={isInView}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}