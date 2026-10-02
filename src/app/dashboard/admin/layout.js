// app/dashboard/admin/layout.js
"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerBody, Spinner } from "@heroui/react";
import { Bars } from "@gravity-ui/icons";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { useRoleGuard } from "@/lib/sessions";

export default function AdminDashboardLayout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isLoading } = useRoleGuard("admin");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex lg:w-[250px] lg:shrink-0 lg:flex-col"
        style={{ backgroundColor: "#18020c" }}
      >
        <AdminSidebar />
      </aside>

      {/* Mobile drawer */}
      <Drawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} placement="left" size="xs">
        <DrawerContent>
          <DrawerBody className="p-0">
            <AdminSidebar onNavigate={() => setIsDrawerOpen(false)} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile header */}
        <header
          className="flex items-center gap-3 border-b px-4 py-3 lg:hidden"
          style={{ backgroundColor: "#ffffff", borderColor: "rgba(122, 108, 93, 0.25)" }}
        >
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-md p-2 transition-colors"
            style={{ color: "#18020c" }}
            aria-label="Open menu"
          >
            <Bars width={22} height={22} />
          </button>
          <span className="font-bold" style={{ color: "#18020c" }}>
            <span style={{ color: "#f1b055" }}>ReSell</span>Hub
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}