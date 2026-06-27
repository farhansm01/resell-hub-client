// app/(main)/products/page.js

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Magnifier } from "@gravity-ui/icons";
import { getProducts } from "@/lib/api/products";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

const CATEGORIES = ["All", "Electronics", "Furniture", "Vehicles", "Fashion", "Mobile Phones"];
const SORT_OPTIONS = [
    { label: "Default", value: "" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
];

export default function AllProductsPage() {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("");

    // dropdowns open state
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    // debounce search input 300ms
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    // fetch products whenever filters change
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProducts({
                search: debouncedSearch,
                category,
                sort,
                page: currentPage,
            });
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error(err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, category, sort, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, category, sort]);

    // condition badge color
    const conditionColor = (condition) => {
        if (condition === "Like New") return "#16A34A";
        if (condition === "Good") return "#CA8A04";
        return "#78716C";
    };

    return (
        <div className="min-h-screen px-4 py-10 max-w-7xl mx-auto" style={{ backgroundColor: "#FAFAF9" }}>

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold" style={{ color: "#1C1917" }}>All Products</h1>
                <p className="text-sm mt-1" style={{ color: "#78716C" }}>Browse quality second-hand items</p>
            </div>

            {/* ── Filter bar ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">

                {/* Search input */}
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#78716C" }}>
                        <Magnifier width={16} height={16} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-orange-400"
                        style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
                    />
                </div>

                {/* Category dropdown */}
                <div className="relative">
                    <button
                        onClick={() => { setCategoryOpen((p) => !p); setSortOpen(false); }}
                        className="w-full sm:w-44 px-4 py-2.5 rounded-xl border text-sm text-left flex items-center justify-between"
                        style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
                    >
                        <span>{category === "all" ? "All Categories" : category}</span>
                        <span style={{ color: "#78716C" }}>▾</span>
                    </button>
                    {categoryOpen && (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border shadow-lg overflow-hidden" style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setCategory(cat.toLowerCase() === "all" ? "all" : cat); setCategoryOpen(false); }}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-orange-50 transition-colors"
                                    style={{ color: "#1C1917" }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                    <button
                        onClick={() => { setSortOpen((p) => !p); setCategoryOpen(false); }}
                        className="w-full sm:w-44 px-4 py-2.5 rounded-xl border text-sm text-left flex items-center justify-between"
                        style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
                    >
                        <span>{SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort By"}</span>
                        <span style={{ color: "#78716C" }}>▾</span>
                    </button>
                    {sortOpen && (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border shadow-lg overflow-hidden" style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}>
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-orange-50 transition-colors"
                                    style={{ color: "#1C1917" }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Product grid ── */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <p className="text-lg font-medium" style={{ color: "#1C1917" }}>No products found</p>
                    <p className="text-sm" style={{ color: "#78716C" }}>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, i) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: i * 0.05 }}
                            className="rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}
                            onClick={() => router.push(`/products/${product._id}`)}
                        >
                            {/* Product image */}
                            <div className="w-full h-48 overflow-hidden bg-gray-50">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Card body */}
                            <div className="p-4 space-y-3">
                                <h3 className="font-semibold text-sm line-clamp-2" style={{ color: "#1C1917" }}>
                                    {product.title}
                                </h3>

                                {/* Badges */}
                                <div className="flex gap-2 flex-wrap">
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                                        style={{ backgroundColor: "#FFF7ED", color: "#F97316" }}
                                    >
                                        {product.category}
                                    </span>
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                                        style={{ backgroundColor: "#F0FDF4", color: conditionColor(product.condition) }}
                                    >
                                        {product.condition}
                                    </span>
                                </div>

                                {/* Price */}
                                <p className="text-lg font-bold" style={{ color: "#F97316" }}>
                                    ৳{product.price.toLocaleString()}
                                </p>

                                {/* View Details button */}
                                <button
                                    onClick={() => router.push(`/products/${product._id}`)}
                                    className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                                    style={{ backgroundColor: "#F97316" }}
                                >
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ── Pagination ── */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 transition-colors hover:bg-orange-50"
                        style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className="w-9 h-9 rounded-xl border text-sm font-medium transition-colors"
                            style={{
                                borderColor: currentPage === i + 1 ? "#F97316" : "#E7E5E4",
                                backgroundColor: currentPage === i + 1 ? "#F97316" : "#FFFFFF",
                                color: currentPage === i + 1 ? "#FFFFFF" : "#1C1917",
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 transition-colors hover:bg-orange-50"
                        style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}