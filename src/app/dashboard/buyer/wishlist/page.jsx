"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getWishlist } from "@/lib/api/wishlist";
import { removeFromWishlist } from "@/lib/actions/wishlist";

export default function WishlistPage() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null); // tracks which item's remove button is loading

  useEffect(() => {
    if (isPending || !userId) return;

    const fetchWishlist = async () => {
      try {
        const data = await getWishlist(userId);
        setItems(data);
      } catch (err) {
        toast.error("Failed to load wishlist");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, [userId, isPending]);

  const handleRemove = async (wishlistId) => {
    setRemovingId(wishlistId);
    try {
      await removeFromWishlist(wishlistId, userId);
      setItems((prev) => prev.filter((item) => item._id !== wishlistId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err.message || "Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm" style={{ color: "#78716C" }}>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Wishlist</h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Products you&apos;ve saved for later.
      </p>

      {items.length === 0 ? (
        <div
          className="mt-6 rounded-2xl p-10 text-center"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
        >
          <p className="text-sm" style={{ color: "#78716C" }}>
            Your wishlist is empty.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium truncate" style={{ color: "#1C1917" }}>{item.title}</p>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ backgroundColor: "#3B5BDB15", color: "#3B5BDB" }}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="mt-1 font-bold" style={{ color: "#F97316" }}>${item.price}</p>

                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/products/${item.productId}`}
                    className="flex-1 text-center text-sm font-medium py-2 rounded-lg border"
                    style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemove(item._id)}
                    disabled={removingId === item._id}
                    className="flex-1 text-sm font-medium py-2 rounded-lg disabled:opacity-60"
                    style={{ backgroundColor: "#DC2626", color: "#FFFFFF" }}
                  >
                    {removingId === item._id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}