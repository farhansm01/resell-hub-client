// app/(main)/about/page.js
"use client";

import { motion } from "framer-motion";
import { TrashBin, PlanetEarth, Persons } from "@gravity-ui/icons";

// stagger container — used for mission cards + how-it-works steps
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// individual item fade + slide up
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MISSION_ITEMS = [
  {
    icon: TrashBin,
    title: "Reduce Waste",
    description:
      "Every item resold is one less item in a landfill. We help extend the life of products that still have plenty of use left in them.",
  },
  {
    icon: PlanetEarth,
    title: "Promote Sustainability",
    description:
      "Buying second-hand cuts down on demand for new manufacturing, lowering carbon footprints one transaction at a time.",
  },
  {
    icon: Persons,
    title: "Create Opportunities",
    description:
      "We give everyday sellers a simple way to earn from items they no longer need, and buyers a way to find great deals.",
  },
];

const STEPS = [
  { number: "01", title: "Seller Creates Account", description: "Sign up in seconds and set up a seller profile." },
  { number: "02", title: "Lists Products", description: "Add photos, pricing, and details for items to sell." },
  { number: "03", title: "Buyer Browses & Purchases", description: "Buyers explore listings and check out securely." },
  { number: "04", title: "Seller Manages Orders", description: "Track, fulfill, and update orders from the dashboard." },
];

const STATS = [
  { value: "1200+", label: "Happy Buyers" },
  { value: "450+", label: "Active Sellers" },
  { value: "3500+", label: "Products Listed" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF9" }}>

      {/* ───────────── Hero Section ───────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold" style={{ color: "#1C1917" }}>
            About ReSell Hub
          </h1>
          <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "#78716C" }}>
            ReSell Hub is a second-hand marketplace built to make buying and selling pre-owned
            goods simple, safe, and sustainable — connecting everyday sellers with buyers looking
            for great deals on quality items.
          </p>
        </motion.div>
      </section>

      {/* ───────────── Mission Section ───────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#1C1917" }}>
            Our Mission
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "#78716C" }}>
            What drives everything we build
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {MISSION_ITEMS.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="rounded-2xl border p-6 flex flex-col items-center text-center gap-3"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
            >
              {/* Icon bubble */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: "#FFF7ED" }}
              >
                <Icon width={28} height={28} style={{ color: "#F97316" }} />
              </div>
              <h3 className="font-semibold text-lg" style={{ color: "#1C1917" }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───────────── How It Works Section ───────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#1C1917" }}>
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "#78716C" }}>
            From sign-up to sold — four simple steps
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STEPS.map(({ number, title, description }) => (
            <motion.div
              key={number}
              variants={itemVariants}
              className="rounded-2xl border p-6 flex flex-col gap-3"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
            >
              {/* Numbered badge */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm"
                style={{ backgroundColor: "#F97316", color: "#FFFFFF" }}
              >
                {number}
              </div>
              <h3 className="font-semibold text-base" style={{ color: "#1C1917" }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───────────── Stats Section ───────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p className="text-4xl sm:text-5xl font-extrabold" style={{ color: "#F97316" }}>
                {value}
              </p>
              <p className="mt-2 text-sm sm:text-base font-medium" style={{ color: "#78716C" }}>
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}