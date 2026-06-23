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
    { label: "Categories", href: "/categories" },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <span style={{ color: "#F97316" }}>ReSell</span>
          <span style={{ color: "#1C1917" }}>Hub</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-orange-500"
              style={{ color: "#1C1917" }}
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
                className="text-sm font-medium hover:text-orange-500"
                style={{ color: "#1C1917" }}
              >
                Dashboard
              </Link>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition hover:border-orange-400"
                  style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                >
                  <Person className="w-4 h-4" />
                  <span>{session.user?.name?.split(" ")[0]}</span>
                </button>

                {/* Dropdown Menu */}
                <div
                  className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
                >
                  <p className="px-4 py-2 text-xs truncate" style={{ color: "#78716C" }}>
                    {session.user?.email}
                  </p>
                  <hr style={{ borderColor: "#E7E5E4" }} />
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm hover:bg-orange-50 transition"
                    style={{ color: "#1C1917" }}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 transition"
                    style={{ color: "#DC2626" }}
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
                className="text-sm font-medium px-4 py-2 rounded-full border transition hover:border-orange-400 hover:text-orange-500"
                style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium px-4 py-2 rounded-full text-white transition hover:opacity-90"
                style={{ backgroundColor: "#F97316" }}
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
          style={{ color: "#1C1917" }}
        >
          {isMenuOpen ? <Xmark className="w-5 h-5" /> : <Bars className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="sm:hidden px-4 pb-4 flex flex-col gap-3 border-t"
          style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium py-2 hover:text-orange-500"
              style={{ color: "#1C1917" }}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {session && (
            <Link
              href="/dashboard"
              className="text-sm font-medium py-2"
              style={{ color: "#F97316" }}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {!session && (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/signin"
                className="text-center text-sm font-medium px-4 py-2 rounded-full border transition hover:border-orange-400"
                style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-block bg-orange-500 text-white px-5 py-2 rounded-full"
              >
                Register
              </Link>
            </div>
          )}

          {session && (
            <button
              onClick={handleSignOut}
              className="text-left text-sm font-medium py-2 flex items-center gap-2"
              style={{ color: "#DC2626" }}
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