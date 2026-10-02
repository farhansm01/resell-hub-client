// app/(main)/products/page.js

"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Magnifier, Xmark } from "@gravity-ui/icons";
import { getProducts } from "@/lib/api/products";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

const CATEGORIES = ["All", "Electronics", "Furniture", "Vehicles", "Fashion", "Mobile Phones", "Gaming & Consoles"];
const SORT_OPTIONS = [
    { label: "Default", value: "" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
];
const CONDITIONS = ["All", "Used", "Like New", "Refurbished"];

function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState(searchParams.get("category") || "all");
    const [sort, setSort] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [condition, setCondition] = useState("all");

    useEffect(() => {
        const catParam = searchParams.get("category");
        if (catParam) {
            setCategory(catParam);
        }
    }, [searchParams]);

    // dropdowns open state
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [conditionOpen, setConditionOpen] = useState(false);

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
                minPrice,
                maxPrice,
                condition,
            });
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error(err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, category, sort, currentPage, minPrice, maxPrice, condition]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, category, sort, minPrice, maxPrice, condition]);

    const conditionColor = (condition) => {
        if (condition === "Like New") return "#16A34A";
        if (condition === "Good") return "#CA8A04";
        return "#7a6c5d";
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setSort("");
        setMinPrice("");
        setMaxPrice("");
        setCondition("all");
        setCurrentPage(1);
    };

    const hasActiveFilters =
        search || category !== "all" || sort || minPrice || maxPrice || condition !== "all";

    return (
        <div className="min-h-screen px-4 py-10 max-w-7xl mx-auto" style={{ backgroundColor: "#ffffff" }}>

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold" style={{ color: "#18020c" }}>All Products</h1>
                <p className="text-sm mt-1" style={{ color: "#7a6c5d" }}>Browse quality second-hand items</p>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-3 mb-8">

                {/* Search input */}
                <div className="relative flex-1 min-w-[200px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#7a6c5d" }}>
                        <Magnifier width={16} height={16} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                        style={{ borderColor: "rgba(122, 108, 93, 0.3)", color: "#18020c", backgroundColor: "#ffffff" }}
                    />
                </div>

                {/* Category dropdown */}
                <div className="relative w-full sm:w-44">
                    <button
                        onClick={() => { setCategoryOpen((p) => !p); setSortOpen(false); setConditionOpen(false); }}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm text-left flex items-center justify-between"
                        style={{ borderColor: "rgba(122, 108, 93, 0.3)", color: "#18020c", backgroundColor: "#ffffff" }}
                    >
                        <span>{category === "all" ? "All Categories" : category}</span>
                        <span style={{ color: "#7a6c5d" }}>▾</span>
                    </button>
                    {categoryOpen && (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border shadow-lg overflow-hidden" style={{ borderColor: "rgba(122, 108, 93, 0.3)", backgroundColor: "#ffffff" }}>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setCategory(cat.toLowerCase() === "all" ? "all" : cat); setCategoryOpen(false); }}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-[#f1b055]/10 transition-colors"
                                    style={{ color: "#18020c" }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort dropdown */}
                <div className="relative w-full sm:w-44">
                    <button
                        onClick={() => { setSortOpen((p) => !p); setCategoryOpen(false); setConditionOpen(false); }}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm text-left flex items-center justify-between"
                        style={{ borderColor: "rgba(122, 108, 93, 0.3)", color: "#18020c", backgroundColor: "#ffffff" }}
                    >
                        <span>{SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort By"}</span>
                        <span style={{ color: "#7a6c5d" }}>▾</span>
                    </button>
                    {sortOpen && (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border shadow-lg overflow-hidden" style={{ borderColor: "rgba(122, 108, 93, 0.3)", backgroundColor: "#ffffff" }}>
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-[#f1b055]/10 transition-colors"
                                    style={{ color: "#18020c" }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Condition dropdown */}
                <div className="relative w-full sm:w-40">
                    <button
                        onClick={() => { setConditionOpen((p) => !p); setCategoryOpen(false); setSortOpen(false); }}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm text-left flex items-center justify-between"
                        style={{ borderColor: "rgba(122, 108, 93, 0.3)", color: "#18020c", backgroundColor: "#ffffff" }}
                    >
                        <span>{condition === "all" ? "All Conditions" : condition}</span>
                        <span style={{ color: "#7a6c5d" }}>▾</span>
                    </button>
                    {conditionOpen && (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border shadow-lg overflow-hidden" style={{ borderColor: "rgba(122, 108, 93, 0.3)", backgroundColor: "#ffffff" }}>
                            {CONDITIONS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => { setCondition(c.toLowerCase() === "all" ? "all" : c); setConditionOpen(false); }}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-[#f1b055]/10 transition-colors"
                                    style={{ color: "#18020c" }}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price range */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min ৳"
                        className="w-full sm:w-24 px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                        style={{ borderColor: "rgba(122, 108, 93, 0.3)", color: "#18020c", backgroundColor: "#ffffff" }}
                    />
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max ৳"
                        className="w-full sm:w-24 px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                        style={{ borderColor: "rgba(122, 108, 93, 0.3)", color: "#18020c", backgroundColor: "#ffffff" }}
                    />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:bg-[#f1b055]/10"
                        style={{ borderColor: "rgba(122, 108, 93, 0.3)", color: "#7a6c5d" }}
                    >
                        <Xmark width={14} height={14} />
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Product grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <p className="text-lg font-medium" style={{ color: "#18020c" }}>No products found</p>
                    <p className="text-sm" style={{ color: "#7a6c5d" }}>Try adjusting your search or filters</p>
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
                            className="rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                            style={{ borderColor: "rgba(122, 108, 93, 0.25)", backgroundColor: "#ffffff" }}
                            onClick={() => router.push(`/products/${product._id}`)}
                        >
                            <div className="w-full h-48 overflow-hidden bg-stone-50">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-4 space-y-3">
                                <h3 className="font-semibold text-sm line-clamp-2" style={{ color: "#18020c" }}>
                                    {product.title}
                                </h3>

                                <div className="flex gap-2 flex-wrap">
                                    <span
                                        className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                                        style={{ backgroundColor: "rgba(241, 176, 85, 0.2)", color: "#18020c" }}
                                    >
                                        {product.category}
                                    </span>
                                    <span
                                        className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                                        style={{ backgroundColor: "#F0FDF4", color: conditionColor(product.condition) }}
                                    >
                                        {product.condition}
                                    </span>
                                </div>

                                <p className="text-lg font-bold" style={{ color: "#f1b055" }}>
                                    ৳{product.price?.toLocaleString()}
                                </p>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/products/${product._id}`);
                                    }}
                                    className="w-full py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                                    style={{ backgroundColor: "#f1b055", color: "#18020c" }}
                                >
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 transition-colors hover:bg-stone-50"
                        style={{ borderColor: "rgba(122, 108, 93, 0.3)", color: "#18020c" }}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className="w-9 h-9 rounded-xl border text-sm font-bold transition-colors"
                            style={{
                                borderColor: currentPage === i + 1 ? "#f1b055" : "rgba(122, 108, 93, 0.3)",
                                backgroundColor: currentPage === i + 1 ? "#f1b055" : "#ffffff",
                                color: currentPage === i + 1 ? "#18020c" : "#18020c",
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 transition-colors hover:bg-stone-50"
                        style={{ borderColor: "rgba(122, 108, 93, 0.3)", color: "#18020c" }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default function AllProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen px-4 py-10 max-w-7xl mx-auto">Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}