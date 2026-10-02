"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Chip, Button } from "@heroui/react";
import {
  House,
  FolderOpen,
  Star,
  ChartColumn,
  Thunderbolt,
  Person,
} from "@gravity-ui/icons";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const NAV_LINKS = [
  { label: "Overview", href: "/dashboard/buyer", icon: House },
  { label: "My Orders", href: "/dashboard/buyer/my-orders", icon: FolderOpen },
  { label: "Wishlist", href: "/dashboard/buyer/wishlist", icon: Star },
  { label: "Payment History", href: "/dashboard/buyer/payment-history", icon: ChartColumn },
  { label: "Write a Review", href: "/dashboard/buyer/write-review", icon: Thunderbolt },
  { label: "Profile", href: "/dashboard/buyer/profile", icon: Person },
];

export default function BuyerSidebar({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      router.push("/");
      await authClient.signOut();
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white" style={{ color: "#18020c" }}>
      {/* Logo -> Links to Homepage */}
      <Link href="/" className="flex items-center gap-1 px-6 py-5 border-b border-[#7a6c5d]/25 hover:opacity-90 transition-opacity">
        <span className="text-xl font-bold" style={{ color: "#f1b055" }}>ReSell</span>
        <span className="text-xl font-bold" style={{ color: "#18020c" }}>Hub</span>
      </Link>

      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#7a6c5d]/25">
        <Avatar src={user?.image || undefined} name={user?.name || "U"} size="sm" className="shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate" style={{ color: "#18020c" }}>
            {user?.name || "Loading..."}
          </span>
          {user?.role && (
            <Chip size="sm" variant="flat" className="text-xs rounded-lg px-2 py-0.5 mt-1 w-fit capitalize font-bold" style={{ backgroundColor: "rgba(241, 176, 85, 0.2)", color: "#18020c" }}>
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
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: isActive ? "#f1b055" : "transparent",
                color: isActive ? "#18020c" : "#7a6c5d",
              }}
            >
              <Icon className="shrink-0" width={20} height={20} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#7a6c5d]/25">
        <Button
          onPress={handleSignOut}
          variant="light"
          className="w-full justify-start gap-3 hover:text-[#18020c] hover:bg-[#f1b055]/15 font-medium"
          style={{ color: "#7a6c5d" }}
          startContent={<Person width={20} height={20} />}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}