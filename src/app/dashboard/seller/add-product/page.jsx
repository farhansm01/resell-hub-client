"use client";

import { useEffect, useRef, useState } from "react";
import {
    Box,
    CircleDollar,
    ArrowUpFromSquare,
    TextAlignLeft,
} from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { addProduct } from "@/lib/actions/products";

// Fixed option lists per spec
const CATEGORY_OPTIONS = ["Electronics", "Furniture", "Vehicles", "Fashion", "Mobile Phones"];
const CONDITION_OPTIONS = ["Used", "Like New", "Refurbished"];

// Empty form shape — reused both for initial state and reset-after-submit
const emptyForm = {
    title: "",
    category: "",
    condition: "",
    price: "",
    stock: "",
    description: "",
};

// Shared field styles, kept in one place so every input/select/textarea stays consistent
const fieldClass =
    "w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 transition";



import { ChevronDown } from "@gravity-ui/icons";

// Custom dropdown — fully styleable, replaces native <select> which can't match the palette
function CustomSelect({ label, value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
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
                  color: "#1C1917",
                  backgroundColor: value === opt ? "#F97316" : "transparent",
                  ...(value === opt && { color: "#FFFFFF" }),
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

export default function AddProductPage() {
    const { data: session } = useSession();
    const seller = session?.user;

    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);

        // Revoke the previous preview URL to avoid memory leaks before creating a new one
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    // Uploads the selected file to imgbb and returns the hosted display URL
    const uploadImageToImgbb = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
            { method: "POST", body: formData }
        );
        const data = await res.json();

        if (!data?.success) {
            throw new Error("Image upload failed");
        }
        return data.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title, category, condition, price, stock, description } = form;
        if (!title || !category || !condition || !price || !stock || !description || !imageFile) {
            toast.error("Please fill in all fields, including an image");
            return;
        }

        setIsSubmitting(true);
        try {
            const imageUrl = await uploadImageToImgbb(imageFile);

            await addProduct({
                title,
                category,
                condition,
                price,
                stock,
                description,
                image: imageUrl,
                sellerId: seller?.id,
                sellerName: seller?.name,
                sellerEmail: seller?.email,
            });

            toast.success("Product submitted for review!");
            setForm(emptyForm);
            setImageFile(null);
            setImagePreview(null);
        } catch (err) {
            toast.error(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // mx-auto is what actually centers this — max-w alone only caps width, doesn't center it
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Add Product</h1>
                <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
                    Fill in the details below. Listings are reviewed before going live.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* ── Product Info Section ── */}
                <div
                    className="rounded-2xl shadow-sm p-5 sm:p-6"
                    style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
                >
                    <h2
                        className="font-semibold text-lg mb-5 flex items-center gap-2"
                        style={{ color: "#1C1917" }}
                    >
                        <Box width={18} height={18} style={{ color: "#F97316" }} />
                        Product Info
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Title — full width */}
                        <div className="flex flex-col gap-1 sm:col-span-2">
                            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Title</label>
                            <input
                                type="text"
                                placeholder="e.g. iPhone 13 Pro Max"
                                value={form.title}
                                onChange={updateField("title")}
                                className={fieldClass}
                                style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                            />
                        </div>

                        <CustomSelect
                            label="Category"
                            value={form.category}
                            onChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
                            options={CATEGORY_OPTIONS}
                            placeholder="Select category"
                        />

                        <CustomSelect
                            label="Condition"
                            value={form.condition}
                            onChange={(val) => setForm((prev) => ({ ...prev, condition: val }))}
                            options={CONDITION_OPTIONS}
                            placeholder="Select condition"
                        />

                        {/* Price — with $ icon prefix */}
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
                                    placeholder="0.00"
                                    value={form.price}
                                    onChange={updateField("price")}
                                    className={`${fieldClass} pl-9`}
                                    style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                                />
                            </div>
                        </div>

                        {/* Stock — with box icon prefix */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium" style={{ color: "#1C1917" }}>Stock</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 pointer-events-none">
                                    <Box width={16} height={16} style={{ color: "#78716C" }} />
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={form.stock}
                                    onChange={updateField("stock")}
                                    className={`${fieldClass} pl-9`}
                                    style={{ borderColor: "#E7E5E4", color: "#1C1917" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Description Section ── */}
                <div
                    className="rounded-2xl shadow-sm p-5 sm:p-6"
                    style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
                >
                    <h2
                        className="font-semibold text-lg mb-5 flex items-center gap-2"
                        style={{ color: "#1C1917" }}
                    >
                        <TextAlignLeft width={18} height={18} style={{ color: "#F97316" }} />
                        Description
                    </h2>
                    <textarea
                        rows={5}
                        placeholder="Describe the product's condition, features, etc."
                        value={form.description}
                        onChange={updateField("description")}
                        className={fieldClass}
                        style={{ borderColor: "#E7E5E4", color: "#1C1917", resize: "vertical" }}
                    />
                </div>

                {/* ── Image Section ── */}
                <div
                    className="rounded-2xl shadow-sm p-5 sm:p-6"
                    style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}
                >
                    <h2
                        className="font-semibold text-lg mb-5 flex items-center gap-2"
                        style={{ color: "#1C1917" }}
                    >
                        <ArrowUpFromSquare width={18} height={18} style={{ color: "#F97316" }} />
                        Product Image
                    </h2>

                    {imagePreview ? (
                        // Preview state — shows the chosen image with an option to change it
                        <div className="flex flex-col items-center gap-3">
                            <img
                                src={imagePreview}
                                alt="Product preview"
                                className="max-h-64 rounded-xl object-contain border"
                                style={{ borderColor: "#E7E5E4" }}
                            />
                            <label
                                className="text-sm font-medium cursor-pointer"
                                style={{ color: "#F97316" }}
                            >
                                Change image
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                    ) : (
                        // Empty state — upload prompt
                        <label
                            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center cursor-pointer transition-colors"
                            style={{ borderColor: "#E7E5E4", backgroundColor: "#FAFAF9" }}
                        >
                            <ArrowUpFromSquare width={22} height={22} style={{ color: "#78716C" }} />
                            <span className="text-sm" style={{ color: "#78716C" }}>
                                Click to upload an image
                            </span>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    )}
                </div>

                {/* ── Actions ── */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundColor: "#F97316" }}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}