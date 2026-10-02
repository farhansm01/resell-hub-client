// src/components/shared/Footer.jsx
import Link from "next/link";
import { MapPin, Envelope, Handset } from "@gravity-ui/icons";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#18020c", color: "#ffffff" }} className="mt-auto border-t border-[#7a6c5d]/20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-bold mb-3" style={{ color: "#f1b055" }}>
              ReSell<span style={{ color: "#ffffff" }}>Hub</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#7a6c5d" }}>
              A trusted second-hand marketplace where you can buy and sell pre-owned products safely and efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: "#f1b055" }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Share Feedback", href: "/feedback" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#f1b055]"
                    style={{ color: "#7a6c5d" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: "#f1b055" }}>
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm" style={{ color: "#7a6c5d" }}>
                <Envelope className="w-4 h-4 shrink-0" style={{ color: "#7a6c5d" }} />
                support@resellhub.com
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "#7a6c5d" }}>
                <Handset className="w-4 h-4 shrink-0" style={{ color: "#7a6c5d" }} />
                +880 1700 000000
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "#7a6c5d" }}>
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#7a6c5d" }} />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: "#f1b055" }}>
              Follow Us
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Facebook", href: "#" },
                { label: "Instagram", href: "#" },
                { label: "Twitter / X", href: "#" },
                { label: "LinkedIn", href: "#" },
              ].map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="text-sm transition-colors hover:text-[#f1b055]"
                    style={{ color: "#7a6c5d" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-10 pt-6 text-center text-xs border-t"
          style={{ borderColor: "#7a6c5d", color: "#7a6c5d" }}
        >
          © {new Date().getFullYear()} ReSellHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}