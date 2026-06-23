// src/components/shared/Footer.jsx
import Link from "next/link";
import { MapPin, Envelope, Handset } from "@gravity-ui/icons";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1C1917", color: "#FAFAF9" }} className="mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-bold mb-3" style={{ color: "#F97316" }}>
              ReSell<span style={{ color: "#FAFAF9" }}>Hub</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
              A trusted second-hand marketplace where you can buy and sell pre-owned products safely and efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: "#F97316" }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-orange-400"
                    style={{ color: "#78716C" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: "#F97316" }}>
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm" style={{ color: "#78716C" }}>
                <Envelope className="w-4 h-4 shrink-0" />
                support@resellhub.com
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "#78716C" }}>
                <Handset className="w-4 h-4 shrink-0" />
                +880 1700 000000
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: "#78716C" }}>
                <MapPin className="w-4 h-4 shrink-0" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: "#F97316" }}>
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
                  
                <a    href={social.href}
                    className="text-sm transition-colors hover:text-orange-400"
                    style={{ color: "#78716C" }}
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
          style={{ borderColor: "#292524", color: "#78716C" }}
        >
          © {new Date().getFullYear()} ReSellHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}