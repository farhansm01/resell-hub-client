// components/home/SustainableMarketplace.jsx
"use client";

import { motion } from "framer-motion";
import { Sparkles, Box, ShieldCheck, Tag } from "@gravity-ui/icons";

const SUSTAINABLE_CARDS = [
  {
    title: "Give Products a Second Life",
    subtitle: "Recirculate & Reuse",
    description:
      "Instead of letting pre-owned tech, fashion, or home goods collect dust, ReSellHub lets you list unused items quickly so others can enjoy them.",
    image: "/images/sustainable_marketplace.jpg",
    badge: "Recirculate",
    icon: Box,
  },
  {
    title: "Verified Pre-Loved Quality",
    subtitle: "Trusted Marketplace",
    description:
      "Shop pre-owned items with confidence. Our seller ratings and item condition tags ensure you know exactly what you're buying before checkout.",
    image: "/images/circular_journey.jpg",
    badge: "Verified Quality",
    icon: ShieldCheck,
  },
  {
    title: "Smart Savings, Less Waste",
    subtitle: "Better for Your Wallet",
    description:
      "Save up to 70% off retail prices by choosing second-hand. It's a smarter way to shop that naturally cuts down on unnecessary packaging and waste.",
    image: "/images/sustainable_shopping.jpg",
    badge: "Smart Choice",
    icon: Tag,
  },
];

export default function SustainableMarketplace() {
  return (
    <section
      className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t border-b select-none overflow-hidden"
      style={{ backgroundColor: "#fdf6ea", borderColor: "rgba(241, 176, 85, 0.3)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#f1b055]/50 text-[#18020c] bg-white shadow-2xs mb-3">
            <Sparkles width={14} height={14} className="text-[#f1b055]" />
            <span>SUSTAINABLE SHOPPING AGENDA</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3"
            style={{ color: "#18020c" }}
          >
            Sustainable Shopping Made Simple
          </h2>

          <p
            className="text-sm sm:text-base font-medium leading-relaxed"
            style={{ color: "#7a6c5d" }}
          >
            How our second-hand marketplace helps you save money and keep quality products in use.
          </p>
        </div>

        {/* 3 Simple Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUSTAINABLE_CARDS.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group rounded-3xl bg-white border shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
              >
                <div>
                  {/* Card Image Container */}
                  <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden bg-stone-100">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#18020c]/90 text-[#f1b055] backdrop-blur-md shadow-sm">
                        <IconComponent width={12} height={12} />
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#f1b055] block mb-1">
                      {card.subtitle}
                    </span>
                    <h3 className="text-xl font-black text-[#18020c] mb-2.5 group-hover:text-[#f1b055] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-[#7a6c5d] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
