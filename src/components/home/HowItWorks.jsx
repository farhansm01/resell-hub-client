// components/home/HowItWorks.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, CreditCard, Box, ArrowRight, Sparkles } from "@gravity-ui/icons";

const UNIVERSAL_STEPS = [
  {
    num: "01",
    title: "List or Discover",
    desc: "Sellers list pre-owned items with photos and prices. Buyers search and discover verified products across categories.",
    icon: Compass,
  },
  {
    num: "02",
    title: "Secure Stripe Checkout",
    desc: "Buyers complete orders instantly via Stripe checkout. Sellers receive order notifications directly in their dashboard.",
    icon: CreditCard,
  },
  {
    num: "03",
    title: "Doorstep Delivery & Payout",
    desc: "Items are delivered directly to buyers with trackable shipping, and sellers receive payouts upon order completion.",
    icon: Box,
  },
];

export default function HowItWorks() {
  return (
    <section
      className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-b overflow-hidden"
      style={{ backgroundColor: "#ffffff", borderColor: "rgba(122, 108, 93, 0.15)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#18020c] bg-[#fdf6ea] border border-[#f1b055]/40 mb-3">
            <Sparkles width={13} height={13} className="text-[#f1b055]" />
            <span>HOW RESELLHUB WORKS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18020c] tracking-tight mb-3">
            Simple, Safe & Transparent
          </h2>

          <p className="text-sm sm:text-base font-normal text-[#7a6c5d]">
            A seamless marketplace experience for both buyers and sellers.
          </p>
        </div>

        {/* 3 Minimal Universal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {UNIVERSAL_STEPS.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="p-7 rounded-2xl bg-[#fdf6ea]/40 border border-[#18020c]/10 hover:border-[#f1b055] hover:bg-white transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black uppercase tracking-widest text-[#f1b055] bg-[#18020c] px-2.5 py-1 rounded-md">
                      Step {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#18020c] text-[#f1b055] flex items-center justify-center shadow-xs">
                      <IconComponent width={20} height={20} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#18020c] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-normal text-[#7a6c5d] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Universal Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-[#18020c]/5">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#18020c] text-[#f1b055] text-sm font-bold hover:bg-[#f1b055] hover:text-[#18020c] transition-all"
          >
            <span>Explore Products</span>
            <ArrowRight width={16} height={16} />
          </Link>

          <Link
            href="/dashboard/seller/add-product"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#fdf6ea] text-[#18020c] text-sm font-bold border border-[#f1b055]/40 hover:border-[#18020c] transition-all"
          >
            <span>Start Selling</span>
            <ArrowRight width={16} height={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}




