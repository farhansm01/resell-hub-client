// src/components/shared/Navbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Person, ArrowRightFromSquare, Bars, Xmark } from "@gravity-ui/icons";
import { useSession, signOut } from "@/lib/auth-client";

export default function AppNavbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: "#18020c" }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <span style={{ color: "#f1b055" }}>ReSell</span>
          <span style={{ color: "#ffffff" }}>Hub</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-[#f1b055]"
              style={{ color: "#ffffff" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden sm:flex items-center gap-3">
          {isPending ? null : session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-[#f1b055]"
                style={{ color: "#ffffff" }}
              >
                Dashboard
              </Link>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition hover:border-[#f1b055]"
                  style={{ borderColor: "#7a6c5d", color: "#ffffff" }}
                >
                  <Person className="w-4 h-4" style={{ color: "#7a6c5d" }} />
                  <span>{session.user?.name?.split(" ")[0]}</span>
                </button>

                {/* Dropdown Menu */}
                <div
                  className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                  style={{ backgroundColor: "#18020c", borderColor: "#7a6c5d" }}
                >
                  <p className="px-4 py-2 text-xs truncate" style={{ color: "#7a6c5d" }}>
                    {session.user?.email}
                  </p>
                  <hr style={{ borderColor: "#7a6c5d" }} />
                  {session.user?.role === "buyer" && (
                    <Link
                      href="/dashboard/buyer/profile"
                      className="block px-4 py-2 text-sm hover:text-[#f1b055] transition"
                      style={{ color: "#ffffff" }}
                    >
                      Profile Settings
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:text-red-400 transition"
                    style={{ color: "#ffffff" }}
                  >
                    <ArrowRightFromSquare className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm font-medium px-4 py-2 rounded-full border transition hover:border-[#f1b055] hover:text-[#f1b055]"
                style={{ borderColor: "#7a6c5d", color: "#ffffff" }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-bold px-4 py-2 rounded-full transition hover:opacity-90"
                style={{ backgroundColor: "#f1b055", color: "#18020c" }}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden p-2 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ color: "#ffffff" }}
        >
          {isMenuOpen ? <Xmark className="w-5 h-5" /> : <Bars className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="sm:hidden px-4 pb-4 flex flex-col gap-3 border-t"
          style={{ borderColor: "#7a6c5d", backgroundColor: "#18020c" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium py-2 hover:text-[#f1b055]"
              style={{ color: "#ffffff" }}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {session && (
            <Link
              href="/dashboard"
              className="text-sm font-medium py-2"
              style={{ color: "#f1b055" }}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {!session && (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/signin"
                className="text-center text-sm font-medium px-4 py-2 rounded-full border transition hover:border-[#f1b055]"
                style={{ borderColor: "#7a6c5d", color: "#ffffff" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-center text-sm font-bold px-5 py-2 rounded-full"
                style={{ backgroundColor: "#f1b055", color: "#18020c" }}
              >
                Register
              </Link>
            </div>
          )}

          {session && (
            <button
              onClick={handleSignOut}
              className="text-left text-sm font-medium py-2 flex items-center gap-2"
              style={{ color: "#ffffff" }}
            >
              <ArrowRightFromSquare className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}