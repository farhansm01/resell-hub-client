// components/home/FAQSection.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CircleQuestion } from "@gravity-ui/icons";

const FAQS = [
  {
    id: "q1",
    question: "How does ReSellHub verify sellers and product listings?",
    answer:
      "All sellers undergo profile verification, and product listings undergo rigorous quality checks. High-value tech items and electronics are reviewed by our team before publication to ensure authenticity.",
  },
  {
    id: "q2",
    question: "What buyer protection guarantees are offered?",
    answer:
      "Every transaction on ReSellHub is backed by our Buyer Protection policy. Payments are securely held in escrow until you receive your order and confirm it matches the seller's description.",
  },
  {
    id: "q3",
    question: "How do payments and delivery work on the platform?",
    answer:
      "We support secure online payment methods including credit/debit cards and mobile banking. Delivery is handled through verified logistics partners with full tracking from door to door.",
  },
  {
    id: "q4",
    question: "What should I do if a received item does not match its description?",
    answer:
      "You have 48 hours after delivery to inspect your purchase. If the item is defective or misdescribed, you can initiate a dispute directly from your Buyer Dashboard for a full refund.",
  },
  {
    id: "q5",
    question: "How do I list my pre-owned items for sale?",
    answer:
      "Simply sign up or sign in, navigate to your Seller Dashboard, and click 'Add Product'. Upload clear photos, set your price, and describe the product condition to go live instantly.",
  },
  {
    id: "q6",
    question: "How can I submit platform feedback or suggestions?",
    answer:
      "We value community feedback! You can share your thoughts anytime via the 'Share Feedback' link in the footer. Approved feedback is featured dynamically in our Community Voices section.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState("q1");

  const toggleFAQ = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t selection:bg-[#f1b055] selection:text-[#18020c] select-none"
      style={{ background: "#ffffff", borderColor: "rgba(122, 108, 93, 0.15)" }}
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#f1b055]/30 text-[#18020c] bg-[#fdf6ea] mb-3 shadow-2xs">
            <CircleQuestion width={14} height={14} className="text-[#f1b055]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
            style={{ color: "#18020c" }}
          >
            Everything You Need to Know
          </h2>

          <p
            className="mt-2.5 max-w-2xl mx-auto text-sm sm:text-base font-medium"
            style={{ color: "#7a6c5d" }}
          >
            Got questions about buying, selling, or verification on ReSellHub? We've got answers.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-2xs"
                style={{
                  borderColor: isOpen
                    ? "rgba(241, 176, 85, 0.5)"
                    : "rgba(122, 108, 93, 0.18)",
                  backgroundColor: isOpen ? "#fdf6ea" : "#ffffff",
                }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <span className="font-bold text-base sm:text-lg text-[#18020c] pr-4">
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 w-8 h-8 rounded-full bg-white border border-[#7a6c5d]/20 flex items-center justify-center text-[#18020c] shadow-2xs"
                  >
                    <ChevronDown width={16} height={16} className="text-[#f1b055]" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base font-medium text-[#7a6c5d] leading-relaxed border-t border-[#7a6c5d]/10 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
