// app/(main)/dashboard/buyer/write-review/page.js

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getBuyerOrders } from "@/lib/api/orders";
import { submitReview } from "@/lib/actions/reviews";

export default function WriteReviewPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState({}); // tracks productIds already reviewed this session

  useEffect(() => {
    if (isPending || !user?.id) return;

    getBuyerOrders(user.id)
      .then((data) => {
        // only delivered orders make sense to review
        setOrders(data.filter((o) => o.orderStatus !== "cancelled"));
      })
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setIsLoading(false));
  }, [user?.id, isPending]);

  const handleSubmit = async () => {
    if (!selectedOrder) return toast.error("Please select a product to review");
    if (rating === 0) return toast.error("Please select a star rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    setSubmitting(true);
    try {
      await submitReview({
        productId: selectedOrder.productId,
        buyerId: user.id,
        buyerName: user.name,
        rating,
        comment: comment.trim(),
      });

      toast.success("Review submitted!");
      setSubmitted((prev) => ({ ...prev, [selectedOrder.productId]: true }));
      setSelectedOrder(null);
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm" style={{ color: "#78716C" }}>Loading your orders...</p>
      </div>
    );
  }

  const reviewableOrders = orders.filter((o) => !submitted[o.productId]);

  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Write a Review</h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Share your experience with products you&apos;ve purchased.
      </p>

      {reviewableOrders.length === 0 ? (
        <div
          className="mt-6 rounded-2xl p-10 text-center"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
        >
          <p className="text-sm" style={{ color: "#78716C" }}>
            No products available to review.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6">

          {/* Step 1 — pick a product */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: "#1C1917" }}>
              Step 1 — Select a product to review
            </p>
            <div className="flex flex-col gap-2">
              {reviewableOrders.map((order) => (
                <button
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                  style={{
                    border: selectedOrder?._id === order._id
                      ? "2px solid #F97316"
                      : "1px solid #E7E5E4",
                    backgroundColor: selectedOrder?._id === order._id
                      ? "#FFF7ED"
                      : "#FAFAF9",
                  }}
                >
                  {order.productImage && (
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#1C1917" }}>
                      {order.productName || "Product"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#78716C" }}>
                      ${order.amount} · {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 — rating and comment */}
          {selectedOrder && (
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
            >
              <p className="text-sm font-semibold mb-4" style={{ color: "#1C1917" }}>
                Step 2 — Rate and review
              </p>

              {/* Star rating */}
              <div className="mb-4">
                <p className="text-xs font-medium mb-2" style={{ color: "#78716C" }}>Your Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      <span style={{
                        color: star <= (hoveredRating || rating) ? "#F97316" : "#E7E5E4"
                      }}>
                        ★
                      </span>
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm self-center" style={{ color: "#78716C" }}>
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <p className="text-xs font-medium mb-2" style={{ color: "#78716C" }}>Your Comment</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Describe your experience with this product..."
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
                  style={{
                    border: "1px solid #E7E5E4",
                    backgroundColor: "#FAFAF9",
                    color: "#1C1917",
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#F97316" }}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}