// app/(main)/checkout/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { createCheckoutSession } from "@/lib/actions/products";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [product, setProduct] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [proceedLoading, setProceedLoading] = useState(false);

  // ── Role guard — buyer only ──
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/signin");
      return;
    }

    if (user?.role !== "buyer") {
      router.replace("/unauthorized");
      return;
    }
  }, [session, isPending, user, router]);
  // ── Read product from sessionStorage — only run after role is confirmed ──
  useEffect(() => {
    // wait for auth to resolve
    if (isPending) return;

    // not logged in
    if (!session) {
      router.replace("/signin");
      return;
    }

    // wrong role — seller/admin
    if (user?.role !== "buyer") {
      router.replace("/unauthorized");
      return;
    }

    // confirmed buyer — now check sessionStorage
    const stored = sessionStorage.getItem("checkoutProduct");
    if (!stored) {
      router.push("/products");
      return;
    }
    try {
      setProduct(JSON.parse(stored));
    } catch {
      router.push("/products");
    }
  }, [isPending, session, user, router]);

  const handleChange = (field) => (e) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleProceed = async () => {
    if (!deliveryInfo.name.trim() || !deliveryInfo.phone.trim() || !deliveryInfo.address.trim()) {
      toast.error("Please fill in all delivery fields");
      return;
    }

    setProceedLoading(true);
    try {
      const session_data = await createCheckoutSession({
        productId: product._id,
        productTitle: product.title,
        price: product.price,
        buyerId: user.id,
        buyerName: user.name,
        buyerEmail: user.email,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        sellerEmail: product.sellerEmail,
        deliveryInfo,
      });

      sessionStorage.removeItem("checkoutProduct");
      window.location.href = session_data.url;
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      setProceedLoading(false);
    }
  };

  // ── Show spinner while auth is resolving or role is wrong ──
  if (isPending || !session || user?.role !== "buyer" || !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="animate-spin rounded-full h-10 w-10 border-4"
          style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-4 py-10"
    >
      {/* Page heading */}
      <h1 className="text-2xl font-bold mb-8" style={{ color: "#1C1917" }}>
        Checkout
      </h1>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left — Order Summary ── */}
        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
        >
          <h2 className="text-base font-semibold mb-5" style={{ color: "#1C1917" }}>
            Order Summary
          </h2>

          {/* Product image */}
          <div
            className="rounded-xl overflow-hidden border mb-5"
            style={{ borderColor: "#E7E5E4" }}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full object-cover max-h-52"
            />
          </div>

          {/* Product title */}
          <p className="text-sm font-semibold mb-4" style={{ color: "#1C1917" }}>
            {product.title}
          </p>

          {/* Summary rows */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#78716C" }}>Price</span>
              <span className="text-sm font-medium" style={{ color: "#1C1917" }}>
                ${product.price.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#78716C" }}>Quantity</span>
              <span className="text-sm font-medium" style={{ color: "#1C1917" }}>1</span>
            </div>

            {/* Divider + Total */}
            <div className="border-t pt-3" style={{ borderColor: "#E7E5E4" }}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: "#1C1917" }}>Total</span>
                <span className="text-lg font-bold" style={{ color: "#F97316" }}>
                  ${product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right — Delivery Information ── */}
        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
        >
          <h2 className="text-base font-semibold mb-5" style={{ color: "#1C1917" }}>
            Delivery Information
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: "#1C1917" }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={deliveryInfo.name}
                onChange={handleChange("name")}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
                style={{
                  borderColor: "#E7E5E4",
                  color: "#1C1917",
                  backgroundColor: "#FFFFFF",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#F97316")}
                onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: "#1C1917" }}>
                Phone
              </label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={deliveryInfo.phone}
                onChange={handleChange("phone")}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition"
                style={{
                  borderColor: "#E7E5E4",
                  color: "#1C1917",
                  backgroundColor: "#FFFFFF",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#F97316")}
                onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: "#1C1917" }}>
                Address
              </label>
              <input
                type="text"
                placeholder="Enter your delivery address"
                value={deliveryInfo.address}
                onChange={handleChange("address")}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition"
                style={{
                  borderColor: "#E7E5E4",
                  color: "#1C1917",
                  backgroundColor: "#FFFFFF",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#F97316")}
                onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            {/* Cancel */}
            <button
              onClick={() => router.push("/products")}
              className="flex-1 rounded-lg border py-2.5 text-sm font-semibold transition hover:bg-[#F5F5F4]"
              style={{ borderColor: "#E7E5E4", color: "#78716C" }}
            >
              Cancel
            </button>

            {/* Proceed to Payment */}
            <button
              onClick={handleProceed}
              disabled={proceedLoading}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ backgroundColor: proceedLoading ? "#C2410C" : "#F97316" }}
            >
              {proceedLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}