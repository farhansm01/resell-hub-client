// app/dashboard/admin/manage-users/page.js
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Chip } from "@heroui/react";
import { Person, TrashBin, Lock, LockOpen } from "@gravity-ui/icons";
import { getAdminUsers } from "@/lib/api/admin";
import { updateUserStatus, deleteUser } from "@/lib/actions/admin";
import { useSession } from "@/lib/auth-client";

export default function ManageUsersPage() {
  const { data: session } = useSession();
  const adminId = session?.user?.id;

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null); // userId to delete

  // fetch users on filter change
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getAdminUsers({
          role: roleFilter !== "all" ? roleFilter : undefined,
          search: search || undefined,
        });
        setUsers(data);
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [roleFilter, search]);

  // block or unblock a user — optimistic update
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    // optimistic
    setUsers((prev) =>
      prev.map((u) => (u._id.toString() === userId ? { ...u, status: newStatus } : u))
    );

    try {
      await updateUserStatus(userId, newStatus);
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"}`);
    } catch (err) {
      toast.error("Failed to update user status");
      // revert on failure
      setUsers((prev) =>
        prev.map((u) => (u._id.toString() === userId ? { ...u, status: currentStatus } : u))
      );
    }
  };

  // delete a user after confirmation
  const handleDelete = async (userId) => {
    setConfirmDelete(null);
    setUsers((prev) => prev.filter((u) => u._id.toString() !== userId));
    try {
      await deleteUser(userId);
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
      // refetch to restore accurate list
      const data = await getAdminUsers();
      setUsers(data);
    }
  };

  // capitalize role for display
  const formatRole = (role) => role.charAt(0).toUpperCase() + role.slice(1);

  // role badge color
  const roleColor = (role) => {
    if (role === "admin") return { bg: "#F97316", text: "#FFFFFF" };
    if (role === "seller") return { bg: "#3B5BDB1A", text: "#3B5BDB" };
    return { bg: "#16A34A1A", text: "#16A34A" };
  };

  const ROLE_TABS = ["all", "buyer", "seller", "admin"];

  return (
    <div>
      {/* Heading */}
      <h1 className="text-2xl font-bold" style={{ color: "#1C1917" }}>Manage Users</h1>
      <p className="mt-1 text-sm" style={{ color: "#78716C" }}>
        View, block, or remove platform users.
      </p>

      {/* Search + filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none sm:max-w-xs"
          style={{ borderColor: "#E7E5E4", color: "#1C1917", backgroundColor: "#FFFFFF" }}
          onFocus={(e) => (e.target.style.borderColor = "#F97316")}
          onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
        />

        {/* Role tabs */}
        <div className="flex gap-2 flex-wrap">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setRoleFilter(tab)}
              className="rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors"
              style={{
                backgroundColor: roleFilter === tab ? "#F97316" : "#FFFFFF",
                color: roleFilter === tab ? "#FFFFFF" : "#78716C",
                border: `1px solid ${roleFilter === tab ? "#F97316" : "#E7E5E4"}`,
              }}
            >
              {tab === "all" ? "All" : formatRole(tab)}
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
      ) : users.length === 0 ? (
        // Empty state
        <div
          className="mt-8 rounded-2xl p-10 text-center border"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
        >
          <Person width={32} height={32} style={{ color: "#E7E5E4", margin: "0 auto" }} />
          <p className="mt-3 text-sm" style={{ color: "#78716C" }}>No users found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden md:block rounded-2xl border overflow-hidden" style={{ borderColor: "#E7E5E4" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "#F5F5F4" }}>
                <tr>
                  {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
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
                {users.map((user, i) => {
                  const uid = user._id.toString();
                  const isAdmin = user.role === "admin";
                  const colors = roleColor(user.role);

                  return (
                    <tr
                      key={uid}
                      className="border-t"
                      style={{ borderColor: "#E7E5E4" }}
                    >
                      {/* Avatar + name + email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                            style={{ backgroundColor: "#F97316", color: "#FFFFFF" }}
                          >
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: "#1C1917" }}>{user.name}</p>
                            <p className="text-xs" style={{ color: "#78716C" }}>{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role badge */}
                      <td className="px-5 py-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {formatRole(user.role)}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: user.status === "blocked" ? "#DC26261A" : "#16A34A1A",
                            color: user.status === "blocked" ? "#DC2626" : "#16A34A",
                          }}
                        >
                          {user.status === "blocked" ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* Join date */}
                      <td className="px-5 py-4" style={{ color: "#78716C" }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        {isAdmin ? (
                          <span className="text-xs" style={{ color: "#78716C" }}>—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {/* Block / Unblock */}
                            <button
                              onClick={() => handleToggleStatus(uid, user.status || "active")}
                              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
                              style={{
                                borderColor: user.status === "blocked" ? "#16A34A" : "#DC2626",
                                color: user.status === "blocked" ? "#16A34A" : "#DC2626",
                              }}
                            >
                              {user.status === "blocked"
                                ? <><LockOpen width={13} height={13} /> Unblock</>
                                : <><Lock width={13} height={13} /> Block</>
                              }
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setConfirmDelete(uid)}
                              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
                              style={{ borderColor: "#E7E5E4", color: "#78716C" }}
                            >
                              <TrashBin width={13} height={13} /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {users.map((user) => {
              const uid = user._id.toString();
              const isAdmin = user.role === "admin";
              const colors = roleColor(user.role);

              return (
                <div
                  key={uid}
                  className="rounded-2xl border p-4"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4" }}
                >
                  {/* Top row */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{ backgroundColor: "#F97316", color: "#FFFFFF" }}
                    >
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: "#1C1917" }}>{user.name}</p>
                      <p className="text-xs truncate" style={{ color: "#78716C" }}>{user.email}</p>
                    </div>
                    {/* Role badge */}
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold shrink-0"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {formatRole(user.role)}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: user.status === "blocked" ? "#DC26261A" : "#16A34A1A",
                        color: user.status === "blocked" ? "#DC2626" : "#16A34A",
                      }}
                    >
                      {user.status === "blocked" ? "Blocked" : "Active"}
                    </span>
                    <span className="text-xs" style={{ color: "#78716C" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  {!isAdmin && (
                    <div className="mt-3 flex gap-2 border-t pt-3" style={{ borderColor: "#E7E5E4" }}>
                      <button
                        onClick={() => handleToggleStatus(uid, user.status || "active")}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium"
                        style={{
                          borderColor: user.status === "blocked" ? "#16A34A" : "#DC2626",
                          color: user.status === "blocked" ? "#16A34A" : "#DC2626",
                        }}
                      >
                        {user.status === "blocked"
                          ? <><LockOpen width={13} height={13} /> Unblock</>
                          : <><Lock width={13} height={13} /> Block</>
                        }
                      </button>
                      <button
                        onClick={() => setConfirmDelete(uid)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium"
                        style={{ borderColor: "#E7E5E4", color: "#78716C" }}
                      >
                        <TrashBin width={13} height={13} /> Delete
                      </button>
                    </div>
                  )}
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
            <h2 className="text-base font-bold" style={{ color: "#1C1917" }}>Delete User?</h2>
            <p className="mt-2 text-sm" style={{ color: "#78716C" }}>
              This action is permanent and cannot be undone.
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