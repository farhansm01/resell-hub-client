// components/home/SustainabilityImpact.jsx
"use client";

import { motion } from "framer-motion";
import { ArrowRotateRight, Box, ShieldCheck, Person, Clock } from "@gravity-ui/icons";

const IMPACT_POINTS = [
  {
    icon: "♻",
    title: "Reduce Waste",
    text: "Keep usable products out of landfills.",
  },
  {
    icon: "↻",
    title: "Extend Life",
    text: "Give products more time in use.",
  },
  {
    icon: "🌱",
    title: "Use Less",
    text: "Reduce demand for new production.",
  },
];

const CIRCULAR_STEPS = [
  {
    num: "01",
    title: "Unused Item",
    desc: "Pre-owned product",
    icon: Box,
    bg: "#18020c",
    text: "#f1b055",
    border: "rgba(241, 176, 85, 0.4)",
  },
  {
    num: "02",
    title: "ReSellHub",
    desc: "Verified platform",
    icon: ShieldCheck,
    bg: "#fdf6ea",
    text: "#18020c",
    border: "rgba(241, 176, 85, 0.6)",
  },
  {
    num: "03",
    title: "New Owner",
    desc: "Delivered to buyer",
    icon: Person,
    bg: "#18020c",
    text: "#f1b055",
    border: "rgba(241, 176, 85, 0.4)",
  },
  {
    num: "04",
    title: "Longer Life",
    desc: "Utility extended",
    icon: Clock,
    bg: "#fdf6ea",
    text: "#18020c",
    border: "rgba(241, 176, 85, 0.6)",
  },
];

function CircularDiagram() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto py-4 select-none">
      {/* Circular Stage Card */}
      <div className="relative bg-[#fdf6ea] rounded-3xl p-6 border shadow-sm flex flex-col items-center justify-center overflow-hidden" style={{ borderColor: "rgba(241, 176, 85, 0.35)" }}>
        
        {/* Decorative Circular Dashed Outer Track */}
        <div className="absolute w-[290px] h-[290px] rounded-full border-2 border-dashed border-[#f1b055]/45 animate-[spin_40s_linear_infinite]" />

        {/* Central Hub Core */}
        <div className="w-24 h-24 rounded-full bg-[#18020c] text-white flex flex-col items-center justify-center text-center p-2 shadow-xl z-20 border-2 border-[#f1b055]/60 my-6">
          <ArrowRotateRight width={20} height={20} className="text-[#f1b055] animate-spin-slow mb-0.5" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#f1b055]">
            ReSellHub
          </span>
          <span className="text-[8px] font-bold text-stone-300">
            Circular Cycle
          </span>
        </div>

        {/* 4 Quadrant Circular Step Nodes */}
        <div className="grid grid-cols-2 gap-4 w-full relative z-10">
          {CIRCULAR_STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                whileHover={{ scale: 1.04, y: -2 }}
                className="rounded-2xl p-3.5 border shadow-xs transition-all flex flex-col justify-between h-24 cursor-pointer"
                style={{
                  backgroundColor: s.bg,
                  color: s.text,
                  borderColor: s.border,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{
                      backgroundColor: s.bg === "#18020c" ? "#fdf6ea" : "#18020c",
                      color: s.bg === "#18020c" ? "#18020c" : "#f1b055",
                    }}
                  >
                    {s.num}
                  </span>
                  <Icon width={15} height={15} style={{ color: s.text }} />
                </div>

                <div>
                  <h4 className="text-xs font-black tracking-tight" style={{ color: s.text }}>
                    {s.title}
                  </h4>
                  <p
                    className="text-[10px] font-medium leading-tight line-clamp-1 opacity-80"
                    style={{ color: s.text }}
                  >
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default function SustainabilityImpact() {
  return (
    <section
      className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t selection:bg-[#f1b055] selection:text-[#18020c] select-none"
      style={{ background: "#ffffff", borderColor: "rgba(122, 108, 93, 0.15)" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Mission Header & Circular Step Diagram */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#f1b055]/30 text-[#18020c] bg-[#fdf6ea] mb-3.5 shadow-2xs">
              <ArrowRotateRight width={14} height={14} className="text-[#f1b055]" />
              <span>CIRCULAR MARKETPLACE MISSION</span>
            </div>

            {/* Headline */}
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3"
              style={{ color: "#18020c" }}
            >
              Give Products a Second Life
            </h2>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg font-medium leading-relaxed mb-6 max-w-xl"
              style={{ color: "#7a6c5d" }}
            >
              Keep useful products in circulation instead of letting them become waste.
            </p>

            {/* Circular Diagram on the Left */}
            <CircularDiagram />
          </div>

          {/* Right Column: Visually Dominant Circular Journey Image Only (No Text Bar Below) */}
          <div className="lg:col-span-6">
            <div
              className="bg-[#fdf6ea] rounded-3xl p-4 sm:p-6 border shadow-xl relative overflow-hidden"
              style={{ borderColor: "rgba(241, 176, 85, 0.35)" }}
            >
              {/* Circular Journey Illustration Image */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-[#f1b055]/20 bg-white shadow-sm">
                <img
                  src="/images/circular_journey.jpg"
                  alt="ReSellHub Circular Product Journey"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3 Separate Impact Cards Below with Hover Animation */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-[#7a6c5d]/15">
          {IMPACT_POINTS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group p-6 sm:p-7 rounded-2xl bg-white border shadow-xs hover:shadow-xl hover:border-[#f1b055]/60 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              style={{ borderColor: "rgba(122, 108, 93, 0.18)" }}
            >
              {/* Icon Circle */}
              <div className="w-12 h-12 rounded-xl bg-[#fdf6ea] border border-[#f1b055]/35 flex items-center justify-center text-xl text-[#18020c] mb-4 shadow-2xs group-hover:bg-[#18020c] group-hover:text-[#f1b055] transition-colors duration-300">
                <span>{item.icon}</span>
              </div>

              {/* Card Title */}
              <h3 className="text-lg font-black text-[#18020c] mb-2 group-hover:text-[#f1b055] transition-colors">
                {item.title}
              </h3>

              {/* Card Supporting Text */}
              <p className="text-xs sm:text-sm font-medium text-[#7a6c5d] leading-relaxed">
                {item.text}
              </p>

              {/* Bottom Gold Accent Indicator Line */}
              <div className="mt-5 pt-3 w-full border-t border-[#7a6c5d]/10 flex items-center justify-between text-[11px] font-bold text-[#18020c]">
                <span>Circular Impact</span>
                <span className="text-[#f1b055]">ReSellHub</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}