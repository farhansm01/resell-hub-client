// app/(main)/contact/page.js
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Envelope, Handset, MapPin } from "@gravity-ui/icons";

// inline SVG icons for socials — not part of Gravity UI's icon set
const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.81 8.44-4.94 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.9 2H22l-7.1 8.13L23 22h-6.97l-5.46-7.13L4.2 22H1l7.6-8.7L1.4 2h7.1l4.93 6.5L18.9 2Zm-2.45 18h1.9L7.65 4h-1.9l10.7 16Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.86 1.05 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76c-.5.5-1.05.86-1.76 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43a4.9 4.9 0 0 1 1.15-1.76c.5-.5 1.05-.86 1.76-1.15.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.92.04-1.42.2-1.75.33-.44.17-.75.37-1.08.7-.33.33-.53.64-.7 1.08-.13.33-.29.83-.33 1.75C4.05 9.01 4.04 9.33 4.04 12s.01 2.99.06 4.04c.04.92.2 1.42.33 1.75.17.44.37.75.7 1.08.33.33.64.53 1.08.7.33.13.83.29 1.75.33 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.92-.04 1.42-.2 1.75-.33.44-.17.75-.37 1.08-.7.33-.33.53-.64.7-1.08.13-.33.29-.83.33-1.75.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.92-.2-1.42-.33-1.75a2.9 2.9 0 0 0-.7-1.08 2.9 2.9 0 0 0-1.08-.7c-.33-.13-.83-.29-1.75-.33-1.05-.05-1.37-.06-4.04-.06Zm0 3.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Zm5.97-2.02a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  // controlled form state — UI only, no backend
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF9" }}>

      {/* ───────────── Hero Section ───────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-8 py-20 max-w-5xl mx-auto text-center"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold" style={{ color: "#1C1917" }}>
          Get in Touch
        </h1>
        <p className="mt-4 text-base sm:text-lg" style={{ color: "#78716C" }}>
          We&apos;d love to hear from you
        </p>
      </motion.section>

      {/* ───────────── Two Column Layout ───────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left: Contact Info ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border p-6 sm:p-8 flex flex-col gap-6"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
          >
            <h2 className="text-xl font-bold" style={{ color: "#1C1917" }}>
              Contact Information
            </h2>

            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                  style={{ backgroundColor: "#FFF7ED" }}
                >
                  <Envelope width={20} height={20} style={{ color: "#F97316" }} />
                </div>
                <span className="text-sm" style={{ color: "#78716C" }}>support@resellhub.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                  style={{ backgroundColor: "#FFF7ED" }}
                >
                  <Handset width={20} height={20} style={{ color: "#F97316" }} />
                </div>
                <span className="text-sm" style={{ color: "#78716C" }}>+880 1700 000000</span>
              </li>
              <li className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                  style={{ backgroundColor: "#FFF7ED" }}
                >
                  <MapPin width={20} height={20} style={{ color: "#F97316" }} />
                </div>
                <span className="text-sm" style={{ color: "#78716C" }}>Dhaka, Bangladesh</span>
              </li>
            </ul>

            {/* Social links */}
            <div className="mt-2">
              <p className="text-sm font-semibold mb-3" style={{ color: "#1C1917" }}>
                Follow Us
              </p>
              <div className="flex gap-3">
                {SOCIALS.map((social) => (
                  
                  <a  key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:opacity-80"
                    style={{ backgroundColor: "#FFF7ED", color: "#F97316" }}
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border p-6 sm:p-8"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: "#1C1917" }}>
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: "#1C1917" }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-orange-400"
                  style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: "#1C1917" }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-orange-400"
                  style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: "#1C1917" }}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-orange-400"
                  style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: "#1C1917" }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us more..."
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-orange-400 resize-none"
                  style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F97316" }}
              >
                Send Message
              </button>
            </form>
          </motion.div>

        </div>
      </section>

    </div>
  );
}