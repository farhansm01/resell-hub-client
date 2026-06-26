"use client";

import { useState, useEffect, useRef } from "react";
import {
    Box,
    CircleDollar,
    ArrowUpFromSquare,
    TextAlignLeft,
    Pencil,
    TrashBin,
    ChevronDown,
} from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { updateProduct, deleteProduct } from "@/lib/actions/products";
import { getMyProducts } from "@/lib/api/products";

const CATEGORY_OPTIONS = ["Electronics", "Furniture", "Vehicles", "Fashion", "Mobile Phones"];
const CONDITION_OPTIONS = ["Used", "Like New", "Refurbished"];

const fieldClass =
    "w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 transition";

// Status badge colors per palette
const STATUS_STYLES = {
    pending: { bg: "#D9770615", text: "#D97706" },
    approved: { bg: "#16A34A15", text: "#16A34A" },
    rejected: { bg: "#DC262615", text: "#DC2626" },
};

function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
    return (
        <span
            className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
            style={{ backgroundColor: style.bg, color: style.text }}
        >
            {status}
        </span>
    );
}

// Same custom dropdown used on Add Product, for consistent styling inside the edit modal
function CustomSelect({ label, value, onChange, options, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-1" ref={ref}>
            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
                    style={{
                        borderColor: isOpen ? "#F97316" : "#E7E5E4",
                        color: value ? "#1C1917" : "#78716C",
                        backgroundColor: "#FFFFFF",
                    }}
                >
                    {value || placeholder}
                    <ChevronDown width={16} height={16} style={{ color: "#78716C" }} />
                </button>

                {isOpen && (
                    <div
                        className="absolute z-10 mt-1 w-full rounded-xl border shadow-md overflow-hidden"
                        style={{ borderColor: "#E7E5E4", backgroundColor: "#FFFFFF" }}
                    >
                        {options.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                                style={{
                                    color: value === opt ? "#FFFFFF" : "#1C1917",
                                    backgroundColor: value === opt ? "#F97316" : "transparent",
                                }}
                                onMouseEnter={(e) => {
                                    if (value !== opt) e.currentTarget.style.backgroundColor = "#FAFAF9";
                                }}
                                onMouseLeave={(e) => {
                                    if (value !== opt) e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Generic modal shell — backdrop + centered card, reused for both edit and delete-confirm
function Modal({ onClose, children, maxWidth = "max-w-lg" }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(28, 25, 23, 0.5)" }}
            onClick={onClose}
        >
            <div
                className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg p-5 sm:p-6`}
                style={{ backgroundColor: "#FFFFFF" }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default function MyProductsPage() {
    const { data: session, isPending } = useSession();
    const sellerId = session?.user?.id;

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editingProduct, setEditingProduct] = useState(null); // product object being edited, or null
    const [editForm, setEditForm] = useState(null);
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [deletingProduct, setDeletingProduct] = useState(null); // product object pending delete confirm
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isPending || !sellerId) return;
        const fetchProducts = async () => {
            try {
                const data = await getMyProducts(sellerId);
                setProducts(data.products);
            } catch (err) {
                toast.error("Failed to load your products");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [sellerId]);

    // ── Edit flow ──

    const openEdit = (product) => {
        setEditingProduct(product);
        setEditForm({
            title: product.title,
            category: product.category,
            condition: product.condition,
            price: String(product.price),
            stock: String(product.stock),
            description: product.description,
        });
        setEditImageFile(null);
        setEditImagePreview(product.image); // show existing image until a new one is chosen
    };

    const closeEdit = () => {
        setEditingProduct(null);
        setEditForm(null);
        setEditImageFile(null);
        setEditImagePreview(null);
    };

    const updateEditField = (field) => (e) => {
        setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files?.[0] || null;
        if (!file) return;
        setEditImageFile(file);
        setEditImagePreview(URL.createObjectURL(file));
    };

    const uploadImageToImgbb = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
            { method: "POST", body: formData }
        );
        const data = await res.json();

        if (!data?.success) throw new Error("Image upload failed");
        return data.data.url;
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        const { title, category, condition, price, stock, description } = editForm;
        if (!title || !category || !condition || !price || !stock || !description) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSaving(true);
        try {
            // Only re-upload if a new file was chosen — otherwise keep the existing image URL
            const imageUrl = editImageFile
                ? await uploadImageToImgbb(editImageFile)
                : editingProduct.image;

            const updated = await updateProduct(editingProduct._id, {
                ...editForm,
                image: imageUrl,
                sellerId,
            });

            setProducts((prev) =>
                prev.map((p) => (p._id === editingProduct._id ? { ...p, ...updated } : p))
            );
            toast.success("Product updated — pending re-review");
            closeEdit();
        } catch (err) {
            toast.error(err.message || "Failed to update product");
        } finally {
            setIsSaving(false);
        }
    };

    // ── Delete flow ──

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteProduct(deletingProduct._id, sellerId);
            setProducts((prev) => prev.filter((p) => p._id !== deletingProduct._id));
            toast.success("Product deleted");
            setDeletingProduct(null);
        } catch (err) {
            toast.error(err.message || "Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-sm" style={{ color: "#78716C" }}>Loading your products...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>My Products</h1>
            <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
                Manage your listed products.
            </p>

            {products.length === 0 ? (
                <div
                    className="mt-6 rounded-2xl p-10 text-center"
                    style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
                >
                    <p className="text-sm" style={{ color: "#78716C" }}>
                        You haven&apos;t listed any products yet.
                    </p>
                </div>
            ) : (
                <>
                    {/* ── Desktop table ── */}
                    <div
                        className="mt-6 hidden sm:block rounded-2xl overflow-hidden"
                        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
                    >
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: "1px solid #E7E5E4" }}>
                                    <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Product</th>
                                    <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Category</th>
                                    <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Price</th>
                                    <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Stock</th>
                                    <th className="text-left px-5 py-3 font-medium" style={{ color: "#78716C" }}>Status</th>
                                    <th className="text-right px-5 py-3 font-medium" style={{ color: "#78716C" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} style={{ borderBottom: "1px solid #E7E5E4" }}>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                    style={{ border: "1px solid #E7E5E4" }}
                                                />
                                                <span className="font-medium" style={{ color: "#1C1917" }}>{product.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3" style={{ color: "#1C1917" }}>{product.category}</td>
                                        <td className="px-5 py-3" style={{ color: "#1C1917" }}>${product.price}</td>
                                        <td className="px-5 py-3" style={{ color: "#1C1917" }}>{product.stock}</td>
                                        <td className="px-5 py-3"><StatusBadge status={product.status} /></td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(product)}
                                                    className="p-2 rounded-lg transition-colors"
                                                    style={{ color: "#3B5BDB" }}
                                                    aria-label="Edit product"
                                                >
                                                    <Pencil width={16} height={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingProduct(product)}
                                                    className="p-2 rounded-lg transition-colors"
                                                    style={{ color: "#DC2626" }}
                                                    aria-label="Delete product"
                                                >
                                                    <TrashBin width={16} height={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile cards ── */}
                    <div className="mt-6 sm:hidden flex flex-col gap-3">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="rounded-2xl p-4"
                                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
                            >
                                <div className="flex items-start gap-3">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                                        style={{ border: "1px solid #E7E5E4" }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-medium truncate" style={{ color: "#1C1917" }}>{product.title}</p>
                                            <StatusBadge status={product.status} />
                                        </div>
                                        <p className="text-sm mt-0.5" style={{ color: "#78716C" }}>
                                            {product.category} · ${product.price} · Stock: {product.stock}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => openEdit(product)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border"
                                        style={{ borderColor: "#E7E5E4", color: "#3B5BDB" }}
                                    >
                                        <Pencil width={14} height={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeletingProduct(product)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border"
                                        style={{ borderColor: "#E7E5E4", color: "#DC2626" }}
                                    >
                                        <TrashBin width={14} height={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── Edit Modal ── */}
            {editingProduct && (
                <Modal onClose={closeEdit} maxWidth="max-w-xl">
                    <h2 className="text-lg font-bold mb-4" style={{ color: "#1C1917" }}>Edit Product</h2>
                    <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Title</label>
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={updateEditField("title")}
                                className={fieldClass}
                                style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CustomSelect
                                label="Category"
                                value={editForm.category}
                                onChange={(val) => setEditForm((prev) => ({ ...prev, category: val }))}
                                options={CATEGORY_OPTIONS}
                                placeholder="Select category"
                            />
                            <CustomSelect
                                label="Condition"
                                value={editForm.condition}
                                onChange={(val) => setEditForm((prev) => ({ ...prev, condition: val }))}
                                options={CONDITION_OPTIONS}
                                placeholder="Select condition"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Price ($)</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 pointer-events-none">
                                        <CircleDollar width={16} height={16} style={{ color: "#78716C" }} />
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editForm.price}
                                        onChange={updateEditField("price")}
                                        className={`${fieldClass} pl-9`}
                                        style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Stock</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 pointer-events-none">
                                        <Box width={16} height={16} style={{ color: "#78716C" }} />
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editForm.stock}
                                        onChange={updateEditField("stock")}
                                        className={`${fieldClass} pl-9`}
                                        style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Description</label>
                            <textarea
                                rows={4}
                                value={editForm.description}
                                onChange={updateEditField("description")}
                                className={fieldClass}
                                style={{ borderColor: "#E7E5E4", color: "#1C1917", resize: "vertical" }}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium" style={{ color: "#1C1917" }}>Product Image</span>
                            <div className="flex items-center gap-3">
                                <img
                                    src={editImagePreview}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-lg object-cover"
                                    style={{ border: "1px solid #E7E5E4" }}
                                />
                                <label
                                    className="text-sm font-medium cursor-pointer"
                                    style={{ color: "#F97316" }}
                                >
                                    Change image
                                    <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <p className="text-xs" style={{ color: "#78716C" }}>
                            Saving changes will set this listing back to <strong>pending</strong> for re-review.
                        </p>

                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium border"
                                style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                                style={{ backgroundColor: "#F97316" }}
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ── Delete Confirm Modal ── */}
            {deletingProduct && (
                <Modal onClose={() => setDeletingProduct(null)} maxWidth="max-w-sm">
                    <h2 className="text-lg font-bold" style={{ color: "#1C1917" }}>Delete Product?</h2>
                    <p className="text-sm mt-2" style={{ color: "#78716C" }}>
                        This will permanently remove &quot;{deletingProduct.title}&quot;. This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-5">
                        <button
                            onClick={() => setDeletingProduct(null)}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium border"
                            style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                            style={{ backgroundColor: "#DC2626" }}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}