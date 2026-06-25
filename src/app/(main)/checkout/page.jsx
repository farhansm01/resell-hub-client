// app/(main)/checkout/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, Input } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { createCheckoutSession } from "@/lib/actions/products";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // product read from sessionStorage
  const [product, setProduct] = useState(null);

  // delivery form fields
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [proceedLoading, setProceedLoading] = useState(false);

  // on mount — read product from sessionStorage, redirect if missing
  useEffect(() => {
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
  }, []);

  // handle delivery form field changes
  const handleChange = (field) => (e) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // proceed to payment — validate, call action, redirect to Stripe
  const handleProceed = async () => {
    // validate all fields filled
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

      // clear sessionStorage after successful session creation
      sessionStorage.removeItem("checkoutProduct");

      // redirect to Stripe hosted checkout
      window.location.href = session_data.url;
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      setProceedLoading(false);
    }
  };

  // loading state while sessionStorage is being read
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent"
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
      style={{ backgroundColor: "#FAFAF9" }}
    >
      {/* Page heading */}
      <h1 className="text-2xl font-bold mb-8" style={{ color: "#1C1917" }}>
        Checkout
      </h1>

      {/* Two column layout — stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left — Order Summary ── */}
        <Card
          radius="md"
          className="p-6 border shadow-none"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
        >
          <h2 className="text-base font-semibold mb-5" style={{ color: "#1C1917" }}>
            Order Summary
          </h2>

          {/* Product image */}
          <div className="rounded-xl overflow-hidden border mb-5" style={{ borderColor: "#E7E5E4" }}>
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

            {/* Divider */}
            <div className="border-t pt-3" style={{ borderColor: "#E7E5E4" }}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: "#1C1917" }}>Total</span>
                <span className="text-lg font-bold" style={{ color: "#F97316" }}>
                  ${product.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Right — Delivery Information ── */}
        <Card
          radius="md"
          className="p-6 border shadow-none"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
        >
          <h2 className="text-base font-semibold mb-5" style={{ color: "#1C1917" }}>
            Delivery Information
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <Input
              radius="md"
              label="Full Name"
              placeholder="Enter your full name"
              value={deliveryInfo.name}
              onChange={handleChange("name")}
              variant="bordered"
            />

            {/* Phone */}
            <Input
              radius="md"
              label="Phone"
              placeholder="Enter your phone number"
              value={deliveryInfo.phone}
              onChange={handleChange("phone")}
              variant="bordered"
            />

            {/* Address */}
            <Input
              radius="md"
              label="Address"
              placeholder="Enter your delivery address"
              value={deliveryInfo.address}
              onChange={handleChange("address")}
              variant="bordered"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            {/* Cancel */}
            <Button
              radius="md"
              variant="bordered"
              onPress={() => router.push("/products")}
              className="flex-1 font-semibold"
              style={{ borderColor: "#E7E5E4", color: "#78716C" }}
            >
              Cancel
            </Button>

            {/* Proceed to Payment */}
            <Button
              radius="md"
              onPress={handleProceed}
              isLoading={proceedLoading}
              disabled={proceedLoading}
              className="flex-1 font-semibold text-white"
              style={{ backgroundColor: "#F97316" }}
            >
              {proceedLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}