// app/(main)/products/[id]/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Chip } from "@heroui/react";
import { ArrowLeft, Star } from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";
import { getProductById } from "@/lib/api/products";
import { getReviewsByProduct } from "@/lib/api/reviews";
import { addToWishlist } from "@/lib/actions/wishlist";
import { toast } from "react-toastify";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  

  // fetch product and reviews on mount
  useEffect(() => {
    if (!id) return;

    getProductById(id)
      .then(setProduct)
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setProductLoading(false));

    getReviewsByProduct(id)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);




  // add to wishlist handler
  const handleAddToWishlist = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    setWishlistLoading(true);
    try {
      await addToWishlist(user.id, id);
      toast.success("Added to wishlist!");
    } catch (err) {
      // 409 means already in wishlist
      if (err.message === "Already in wishlist") {
        toast.error("Already in your wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  
  // buy now handler — stores product in sessionStorage and redirects to checkout
  const handleBuyNow = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }

    // store product data for checkout page
    sessionStorage.setItem(
      "checkoutProduct",
      JSON.stringify({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        sellerEmail: product.sellerEmail,
      })
    );

    router.push("/checkout");
  };
  // star rating display
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        width={14}
        height={14}
        style={{ color: i < rating ? "#F97316" : "#E7E5E4" }}
      />
    ));
  };

  // loading state
  if (productLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent"
          style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  // product not found
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg font-medium" style={{ color: "#1C1917" }}>Product not found</p>
        <Button radius="md" onPress={() => router.push("/products")} style={{ backgroundColor: "#F97316" }} className="text-white font-semibold">
          Back to Products
        </Button>
      </div>
    );
  }

  // role check — sellers can't buy
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";
  const showActions = !isSeller && !isAdmin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 py-10"
      style={{ backgroundColor: "#FAFAF9" }}
    >
      {/* Back button */}
      <button
        onClick={() => router.push("/products")}
        className="flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity"
        style={{ color: "#78716C" }}
      >
        <ArrowLeft width={16} height={16} />
        Back to Products
      </button>

      {/* ── Main product section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

        {/* Left — product image */}
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#E7E5E4" }}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover max-h-[480px]"
          />
        </div>

        {/* Right — product details */}
        <div className="flex flex-col gap-4">

          <h1 className="text-2xl font-bold leading-snug" style={{ color: "#1C1917" }}>
            {product.title}
          </h1>

          <p className="text-3xl font-bold" style={{ color: "#F97316" }}>
            ${product.price.toLocaleString()}
          </p>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: "#FFF7ED", color: "#F97316" }}
            >
              {product.category}
            </span>
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: "#F0FDF4", color: "#16A34A" }}
            >
              {product.condition}
            </span>
          </div>

          {/* Stock */}
          <p className="text-sm font-medium">
            {product.stock > 0 ? (
              <span style={{ color: "#16A34A" }}>✓ In Stock ({product.stock} available)</span>
            ) : (
              <span style={{ color: "#DC2626" }}>✗ Out of Stock</span>
            )}
          </p>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
            {product.description}
          </p>

          {/* Seller info */}
          <div
            className="rounded-xl p-4 border"
            style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#78716C" }}>
              Seller Information
            </p>
            <p className="text-sm font-medium" style={{ color: "#1C1917" }}>{product.sellerName}</p>
            <p className="text-sm" style={{ color: "#78716C" }}>{product.sellerEmail}</p>
          </div>

          {/* Action buttons */}
          {showActions && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleAddToWishlist}
                disabled={wishlistLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ borderColor: "#F97316", color: "#F97316", backgroundColor: "transparent" }}
              >
                {wishlistLoading ? "Adding..." : "Add to Wishlist"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#F97316" }}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews section ── */}
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}
      >
        <h2 className="text-lg font-bold mb-6" style={{ color: "#1C1917" }}>
          Customer Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2">
            <p className="text-sm" style={{ color: "#78716C" }}>No reviews yet</p>
            <p className="text-xs" style={{ color: "#78716C" }}>Be the first to review this product</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 rounded-xl border"
                style={{ borderColor: "#E7E5E4", backgroundColor: "#FAFAF9" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold" style={{ color: "#1C1917" }}>
                    {review.reviewerInfo?.name || "Anonymous"}
                  </p>
                  <div className="flex gap-0.5">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-sm" style={{ color: "#78716C" }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}