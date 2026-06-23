"use client";

import { motion } from "framer-motion";
import { Card } from "@heroui/react";
import {
  TrashBin,
  ArrowRotateRight,
  PlanetEarth,
} from "@gravity-ui/icons";

const impacts = [
  {
    id: 1,
    icon: TrashBin,
    title: "Reduce Waste",
    description:
      "Give pre-owned products a second life and help reduce unnecessary landfill waste.",
  },
  {
    id: 2,
    icon: ArrowRotateRight,
    title: "Extend Product Life",
    description:
      "Encourage reuse and maximize the value of products before they are discarded.",
  },
  {
    id: 3,
    icon: PlanetEarth,
    title: "Lower Carbon Footprint",
    description:
      "Buying second-hand reduces manufacturing demand and helps conserve resources.",
  },
];

export default function SustainabilityImpact() {
  return (
    <section
      className="w-full py-16 px-4 sm:px-6 lg:px-8"
      style={{ background: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#16A34A" }}
          >
            Sustainable Marketplace
          </p>

          <h2
            className="text-3xl sm:text-4xl font-extrabold"
            style={{ color: "#1C1917" }}
          >
            Every Purchase Makes an Impact
          </h2>

          <p
            className="mt-3 max-w-2xl mx-auto"
            style={{ color: "#78716C" }}
          >
            Small choices can make a big difference for the environment and
            future generations.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;

            return (
              <motion.div
                key={impact.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <Card
                  className="h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E7E5E4",
                  }}
                >
                  <Card.Content className="p-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{
                        background: "#DCFCE7",
                      }}
                    >
                      <Icon
                        className="size-7"
                        style={{ color: "#16A34A" }}
                      />
                    </div>

                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ color: "#1C1917" }}
                    >
                      {impact.title}
                    </h3>

                    <p
                      className="leading-relaxed"
                      style={{ color: "#78716C" }}
                    >
                      {impact.description}
                    </p>
                  </Card.Content>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}