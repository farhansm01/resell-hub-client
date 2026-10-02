"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerBody, Spinner } from "@heroui/react";
import { Bars } from "@gravity-ui/icons";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import { useRoleGuard } from "@/lib/sessions";

export default function SellerDashboardLayout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isLoading } = useRoleGuard("seller");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className="hidden lg:flex lg:w-[250px] lg:shrink-0 lg:flex-col border-r border-[#7a6c5d]/25">
        <SellerSidebar />
      </aside>

      <Drawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} placement="left" size="xs">
        <DrawerContent>
          <DrawerBody className="p-0">
            <SellerSidebar onNavigate={() => setIsDrawerOpen(false)} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="flex items-center gap-3 border-b border-[#7a6c5d]/25 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-md p-2 hover:bg-[#f1b055]/10"
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