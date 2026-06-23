"use client";

import { motion } from "framer-motion";
import { Card, Chip, Avatar } from "@heroui/react";
import { StarFill } from "@gravity-ui/icons";

const stories = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Buyer",
    quote:
      "I found a study desk in excellent condition for nearly half the retail price. The entire process was smooth and reliable.",
  },
  {
    id: 2,
    name: "Tanvir Hasan",
    role: "Seller",
    quote:
      "I sold my unused electronics within a few days and earned extra cash without any hassle. ReSell Hub made it incredibly easy.",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Buyer",
    quote:
      "I purchased a like-new phone and saved thousands compared to buying a new one. Definitely worth it.",
  },
];

export default function SuccessStories() {
  return (
    <section
      className="w-full py-16 px-4 sm:px-6 lg:px-8"
      style={{ background: "#FAFAF9" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#F97316" }}
          >
            Community Voices
          </p>

          <h2
            className="text-3xl sm:text-4xl font-extrabold"
            style={{ color: "#1C1917" }}
          >
            Success Stories
          </h2>

          <p
            className="mt-3 max-w-2xl mx-auto"
            style={{ color: "#78716C" }}
          >
            Hear from buyers and sellers who found value through ReSell Hub.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
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
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar
                      name={story.name}
                      className="shrink-0"
                    />

                    <div>
                      <h3
                        className="font-bold"
                        style={{ color: "#1C1917" }}
                      >
                        {story.name}
                      </h3>

                      <Chip
                        size="sm"
                        variant="soft"
                        color={story.role === "Seller" ? "warning" : "primary"}
                      >
                        {story.role}
                      </Chip>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarFill
                        key={i}
                        className="size-4"
                        style={{ color: "#F97316" }}
                      />
                    ))}
                  </div>

                  <p
                    className="leading-relaxed"
                    style={{ color: "#78716C" }}
                  >
                    &quot;{story.quote}&quot;
                  </p>
                </Card.Content>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}