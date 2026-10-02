// app/dashboard/admin/feedback/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Star,
  StarFill,
  Magnifier,
  TrashBin,
  Check,
  Xmark,
  Plus,
  Person,
} from "@gravity-ui/icons";
import {
  getAdminFeedback,
  updateAdminFeedbackStatus,
  deleteAdminFeedback,
  submitFeedback,
} from "@/lib/api/feedback";

const STATUS_TABS = ["all", "pending", "approved", "rejected"];

const statusBadgeStyle = (status) => {
  if (status === "approved") return { bg: "#16A34A1A", text: "#16A34A", border: "rgba(22, 163, 74, 0.3)" };
  if (status === "rejected") return { bg: "#DC26261A", text: "#DC2626", border: "rgba(220, 38, 38, 0.3)" };
  return { bg: "#D976061A", text: "#D97706", border: "rgba(217, 118, 6, 0.3)" }; // pending
};

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Modal for adding feedback manually as admin
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    role: "Buyer",
    rating: 5,
    comment: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminFeedback({
        status: statusFilter,
        search,
      });
      setFeedbackList(data);
    } catch (err) {
      toast.error("Failed to load feedback");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [statusFilter, search]);

  const handleStatusChange = async (id, newStatus) => {
    const prevList = [...feedbackList];
    setFeedbackList((list) =>
      list.map((item) => (item._id.toString() === id ? { ...item, status: newStatus } : item))
    );

    try {
      await updateAdminFeedbackStatus(id, newStatus);
      toast.success(`Feedback status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
      setFeedbackList(prevList);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdminFeedback(id);
      setFeedbackList((list) => list.filter((item) => item._id.toString() !== id));
      toast.success("Feedback deleted successfully");
    } catch (err) {
      toast.error("Failed to delete feedback");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleCreateFeedback = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.comment.trim()) {
      toast.error("Name and comment are required.");
      return;
    }

    try {
      setIsSaving(true);
      await submitFeedback(addForm);
      toast.success("Feedback added! Approve it to feature on homepage.");
      setShowAddModal(false);
      setAddForm({ name: "", email: "", role: "Buyer", rating: 5, comment: "" });
      fetchFeedback();
    } catch (err) {
      toast.error("Failed to add feedback.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#18020c" }}>
            Manage Community Feedback
          </h1>
          <p className="text-sm mt-1" style={{ color: "#7a6c5d" }}>
            Review, approve, or delete feedback entries for the homepage Community Voices section.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-[#18020c] transition hover:opacity-90 shadow-sm cursor-pointer shrink-0"
          style={{ backgroundColor: "#f1b055" }}
        >
          <Plus width={18} height={18} />
          <span>Add New Review</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border" style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}>
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer capitalize"
              style={{
                backgroundColor: statusFilter === tab ? "#18020c" : "#fdf6ea",
                color: statusFilter === tab ? "#f1b055" : "#18020c",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Magnifier width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6c5d]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or content..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border outline-none focus:border-[#f1b055]"
            style={{ borderColor: "rgba(122, 108, 93, 0.3)" }}
          />
        </div>
      </div>

      {/* Feedback List / Table */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse bg-stone-100 border border-stone-200" />
          ))}
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border" style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}>
          <Star width={36} height={36} className="mx-auto text-[#7a6c5d] opacity-50 mb-2" />
          <h3 className="text-base font-bold text-[#18020c]">No feedback entries found</h3>
          <p className="text-xs text-[#7a6c5d] mt-1">Try clearing your search or status filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {feedbackList.map((item) => {
            const badge = statusBadgeStyle(item.status);

            return (
              <motion.div
                key={item._id}
                layout
                className="p-5 rounded-2xl bg-white border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
              >
                {/* Left Section: User Info & Comment */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-base" style={{ color: "#18020c" }}>
                      {item.name}
                    </span>
                    
                    {item.email && (
                      <span className="text-xs font-medium text-[#7a6c5d]">
                        ({item.email})
                      </span>
                    )}

                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase"
                      style={{ backgroundColor: "rgba(241, 176, 85, 0.2)", color: "#18020c" }}
                    >
                      {item.role || "Buyer"}
                    </span>

                    {/* Status Badge */}
                    <span
                      className="text-xs font-extrabold px-3 py-0.5 rounded-full uppercase border"
                      style={{ backgroundColor: badge.bg, color: badge.text, borderColor: badge.border }}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarFill
                        key={star}
                        width={14}
                        height={14}
                        style={{ color: star <= item.rating ? "#f1b055" : "rgba(122, 108, 93, 0.25)" }}
                      />
                    ))}
                    <span className="text-xs font-bold text-[#7a6c5d] ml-1">
                      {item.rating}/5
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm font-medium leading-relaxed text-[#18020c]">
                    "{item.comment}"
                  </p>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                  {item.status !== "approved" && (
                    <button
                      onClick={() => handleStatusChange(item._id, "approved")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition cursor-pointer"
                    >
                      <Check width={14} height={14} />
                      Approve
                    </button>
                  )}

                  {item.status !== "rejected" && (
                    <button
                      onClick={() => handleStatusChange(item._id, "rejected")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                    >
                      <Xmark width={14} height={14} />
                      Reject
                    </button>
                  )}

                  {/* Delete Button */}
                  {confirmDeleteId === item._id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 text-white cursor-pointer"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(item._id)}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
                      title="Delete Feedback"
                    >
                      <TrashBin width={16} height={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Feedback Manually as Admin */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border relative"
              style={{ borderColor: "rgba(122, 108, 93, 0.2)" }}
            >
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-xl font-extrabold" style={{ color: "#18020c" }}>
                  Add Manual Feedback
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-[#7a6c5d] hover:bg-stone-100 cursor-pointer"
                >
                  <Xmark width={20} height={20} />
                </button>
              </div>

              <form onSubmit={handleCreateFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#18020c" }}>
                    Reviewer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#18020c] outline-none"
                    style={{ borderColor: "rgba(122, 108, 93, 0.3)" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#18020c" }}>
                      Role
                    </label>
                    <select
                      value={addForm.role}
                      onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#18020c] outline-none"
                      style={{ borderColor: "rgba(122, 108, 93, 0.3)" }}
                    >
                      <option value="Buyer">Buyer</option>
                      <option value="Seller">Seller</option>
                      <option value="Community Member">Community Member</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#18020c" }}>
                      Rating (1-5)
                    </label>
                    <select
                      value={addForm.rating}
                      onChange={(e) => setAddForm({ ...addForm, rating: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#18020c] outline-none"
                      style={{ borderColor: "rgba(122, 108, 93, 0.3)" }}
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#18020c" }}>
                    Feedback Comment *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={addForm.comment}
                    onChange={(e) => setAddForm({ ...addForm, comment: e.target.value })}
                    placeholder="Enter review message..."
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#18020c] outline-none resize-none"
                    style={{ borderColor: "rgba(122, 108, 93, 0.3)" }}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#18020c] bg-[#f1b055] cursor-pointer"
                  >
                    {isSaving ? "Saving..." : "Add Feedback"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
