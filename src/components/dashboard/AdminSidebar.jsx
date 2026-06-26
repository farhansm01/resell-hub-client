"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Chip, Button } from "@heroui/react";
import { House, Person, FolderOpen, ChartColumn } from "@gravity-ui/icons";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

// Placeholder — update once admin pages (approve companies, manage users, etc.) exist
const NAV_LINKS = [
  { label: "Overview", href: "/dashboard/admin", icon: House },
  { label: "Manage Users", href: "/dashboard/admin/users", icon: Person },
  { label: "Approvals", href: "/dashboard/admin/approvals", icon: FolderOpen },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: ChartColumn },
];

export default function AdminSidebar({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (err) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white text-[#1C1917]">
      <div className="flex items-center gap-1 px-6 py-5 border-b border-[#E7E5E4]">
        <span className="text-xl font-bold text-[#F97316]">ReSell</span>
        <span className="text-xl font-bold text-[#1C1917]">Hub</span>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E7E5E4]">
        <Avatar src={user?.image || undefined} name={user?.name || "U"} size="sm" className="shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate text-[#1C1917]">
            {user?.name || "Loading..."}
          </span>
          {user?.role && (
            <Chip size="sm" variant="flat" className="mt-1 w-fit bg-[#F97316]/15 text-[#C2410C] capitalize">
              {user.role}
            </Chip>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-[#F97316] text-white" : "text-[#78716C] hover:bg-[#F97316]/10 hover:text-[#1C1917]"
                }`}
            >
              <Icon className="shrink-0" width={20} height={20} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#E7E5E4]">
        <Button
          onPress={handleSignOut}
          variant="light"
          className="w-full justify-start gap-3 text-[#78716C] hover:text-[#1C1917] hover:bg-[#F97316]/10"
          startContent={<Person width={20} height={20} />}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}