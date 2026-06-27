// components/dashboard/AdminSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  Person,
  LayoutCellsLarge,
  FolderOpen,
  ChartColumn,
  Thunderbolt,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";
import { signOut } from "@/lib/auth-client";

const NAV_LINKS = [
  { label: "Overview", href: "/dashboard/admin", icon: House },
  { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: Person },
  { label: "Manage Products", href: "/dashboard/admin/manage-products", icon: LayoutCellsLarge },
  { label: "Manage Orders", href: "/dashboard/admin/manage-orders", icon: FolderOpen },
  { label: "Manage Payments", href: "/dashboard/admin/manage-payments", icon: ChartColumn },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: Thunderbolt },
];

export default function AdminSidebar({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: "#1C1917" }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "#292524" }}>
        <span className="text-lg font-bold" style={{ color: "#FAFAF9" }}>
          <span style={{ color: "#F97316" }}>ReSell</span>Hub
        </span>
        <p className="text-xs mt-0.5" style={{ color: "#78716C" }}>Admin Panel</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          // exact match for overview, startsWith for nested pages
          const isActive =
            href === "/dashboard/admin"
              ? pathname === "/dashboard/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: isActive ? "#F97316" : "transparent",
                color: isActive ? "#FFFFFF" : "#A8A29E",
              }}
            >
              <Icon width={18} height={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "#292524" }}>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#292524]"
          style={{ color: "#A8A29E" }}
        >
          <ArrowRightFromSquare width={18} height={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}