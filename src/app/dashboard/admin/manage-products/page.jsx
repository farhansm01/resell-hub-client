// app/dashboard/admin/manage-products/page.js
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { LayoutCellsLarge, TrashBin, Check, Xmark } from "@gravity-ui/icons";
import { getAdminProducts } from "@/lib/api/admin";
import { updateProductStatus, deleteAdminProduct } from "@/lib/actions/admin";

const STATUS_TABS = ["all", "pending", "approved", "rejected"];

const statusStyle = (status) => {
  if (status === "approved") return { bg: "#16A34A1A", text: "#16A34A" };
  if (status === "rejected") return { bg: "#DC26261A", text: "#DC2626" };
  return { bg: "#D976061A", text: "#D97706" }; // pending
};

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // fetch on filter change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getAdminProducts({
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: search || undefined,
        });
        setProducts(data);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [statusFilter, search]);

  // approve or reject — optimistic update
  const handleStatusChange = async (productId, newStatus) => {
    const prev = products.find((p) => p._id.toString() === productId)?.status;

    // optimistic
    setProducts((all) =>
      all.map((p) => p._id.toString() === productId ? { ...p, status: newStatus } : p)
    );

    try {
      await updateProductStatus(productId, newStatus);
      toast.success(`Product ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update product status");
      // revert
      setProducts((all) =>
        all.map((p) => p._id.toString() === productId ? { ...p, status: prev } : p)
      );
    }
  };

  // delete — optimistic
  const handleDelete = async (productId) => {
    setConfirmDelete(null);
    setProducts((all) => all.filter((p) => p._id.toString() !== productId));
    try {
      await deleteAdminProduct(productId);
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
      const data = await getAdminProducts();
      setProducts(data);
    }
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Manage Products</h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        Approve, reject, or remove product listings.
      </p>

      {/* Search + filter tabs */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by product title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none sm:max-w-xs"
          style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
          onFocus={(e) => (e.target.style.borderColor = "#F97316")}
          onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
        />

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className="rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors"
              style={{
                backgroundColor: statusFilter === tab ? "#F97316" : "#FFFFFF",
                color: statusFilter === tab ? "#FFFFFF" : "#78716C",
                border: `1px solid ${statusFilter === tab ? "#F97316" : "#E7E5E4"}`,
              }}
            >
              {capitalize(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="mt-10 flex justify-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-4"
            style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
          />
        </div>
      ) : products.length === 0 ? (
        <div
          className="mt-8 rounded-2xl border p-10 text-center"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
        >
          <LayoutCellsLarge width={32} height={32} style={{ color: "#E7E5E4", margin: "0 auto" }} />
          <p className="mt-3 text-sm" style={{ color: "#78716C" }}>No products found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden md:block rounded-2xl border overflow-hidden" style={{ borderColor: "#E7E5E4" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "#F5F5F4" }}>
                <tr>
                  {["Product", "Category", "Price", "Seller", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "#78716C" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "#FFFFFF" }}>
                {products.map((product) => {
                  const pid = product._id.toString();
                  const style = statusStyle(product.status);

                  return (
                    <tr key={pid} className="border-t" style={{ borderColor: "#E7E5E4" }}>
                      {/* Thumbnail + title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-10 w-10 rounded-lg object-cover shrink-0 border"
                            style={{ borderColor: "#E7E5E4" }}
                          />
                          <p
                            className="font-medium max-w-[180px] truncate"
                            style={{ color: "#1C1917" }}
                          >
                            {product.title}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ backgroundColor: "#3B5BDB1A", color: "#3B5BDB" }}
                        >
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-semibold" style={{ color: "#F97316" }}>
                        ${product.price.toLocaleString()}
                      </td>

                      {/* Seller */}
                      <td className="px-5 py-4" style={{ color: "#78716C" }}>
                        {product.sellerName || "—"}
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* Approve — hide if already approved */}
                          {product.status !== "approved" && (
                            <button
                              onClick={() => handleStatusChange(pid, "approved")}
                              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                              style={{ borderColor: "#16A34A", color: "#16A34A" }}
                            >
                              <Check width={13} height={13} /> Approve
                            </button>
                          )}

                          {/* Reject — hide if already rejected */}
                          {product.status !== "rejected" && (
                            <button
                              onClick={() => handleStatusChange(pid, "rejected")}
                              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                              style={{ borderColor: "#DC2626", color: "#DC2626" }}
                            >
                              <Xmark width={13} height={13} /> Reject
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setConfirmDelete(pid)}
                            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                            style={{ borderColor: "#E7E5E4", color: "#78716C" }}
                          >
                            <TrashBin width={13} height={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {products.map((product) => {
              const pid = product._id.toString();
              const style = statusStyle(product.status);

              return (
                <div
                  key={pid}
                  className="rounded-2xl border p-4"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
                >
                  {/* Image + title */}
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-12 w-12 rounded-lg object-cover shrink-0 border"
                      style={{ borderColor: "#E7E5E4" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: "#1C1917" }}>{product.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#78716C" }}>
                        by {product.sellerName || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{ backgroundColor: "#3B5BDB1A", color: "#3B5BDB" }}
                    >
                      {product.category}
                    </span>
                    <span className="font-semibold text-sm" style={{ color: "#F97316" }}>
                      ${product.price.toLocaleString()}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
                      style={{ backgroundColor: style.bg, color: style.text }}
                    >
                      {product.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2 flex-wrap border-t pt-3" style={{ borderColor: "#E7E5E4" }}>
                    {product.status !== "approved" && (
                      <button
                        onClick={() => handleStatusChange(pid, "approved")}
                        className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium"
                        style={{ borderColor: "#16A34A", color: "#16A34A" }}
                      >
                        <Check width={13} height={13} /> Approve
                      </button>
                    )}
                    {product.status !== "rejected" && (
                      <button
                        onClick={() => handleStatusChange(pid, "rejected")}
                        className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium"
                        style={{ borderColor: "#DC2626", color: "#DC2626" }}
                      >
                        <Xmark width={13} height={13} /> Reject
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDelete(pid)}
                      className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium"
                      style={{ borderColor: "#E7E5E4", color: "#78716C" }}
                    >
                      <TrashBin width={13} height={13} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-xl"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <h2 className="text-base font-bold" style={{ color: "#1C1917" }}>Delete Product?</h2>
            <p className="mt-2 text-sm" style={{ color: "#78716C" }}>
              This will permanently remove the listing.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-lg border py-2.5 text-sm font-semibold transition hover:bg-[#F5F5F4]"
                style={{ borderColor: "#E7E5E4", color: "#78716C" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: "#DC2626" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}