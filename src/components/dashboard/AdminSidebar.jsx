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
  Star,
} from "@gravity-ui/icons";
import { signOut } from "@/lib/auth-client";

const NAV_LINKS = [
  { label: "Overview", href: "/dashboard/admin", icon: House },
  { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: Person },
  { label: "Manage Products", href: "/dashboard/admin/manage-products", icon: LayoutCellsLarge },
  { label: "Manage Orders", href: "/dashboard/admin/manage-orders", icon: FolderOpen },
  { label: "Manage Payments", href: "/dashboard/admin/manage-payments", icon: ChartColumn },
  { label: "Manage Feedback", href: "/dashboard/admin/feedback", icon: Star },
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
      style={{ backgroundColor: "#18020c" }}
    >
      {/* Logo -> Links to Homepage */}
      <Link href="/" className="px-6 py-5 border-b block hover:opacity-90 transition-opacity" style={{ borderColor: "rgba(122, 108, 93, 0.25)" }}>
        <span className="text-lg font-bold">
          <span style={{ color: "#f1b055" }}>ReSell</span>
          <span style={{ color: "#ffffff" }}>Hub</span>
        </span>
        <p className="text-xs mt-0.5" style={{ color: "#7a6c5d" }}>Admin Panel</p>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/dashboard/admin"
              ? pathname === "/dashboard/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: isActive ? "#f1b055" : "transparent",
                color: isActive ? "#18020c" : "#7a6c5d",
              }}
            >
              <Icon width={18} height={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(122, 108, 93, 0.25)" }}>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:text-[#f1b055]"
          style={{ color: "#7a6c5d" }}
        >
          <ArrowRightFromSquare width={18} height={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}