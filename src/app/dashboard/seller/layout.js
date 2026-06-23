"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerBody } from "@heroui/react";
import { Bars } from "@gravity-ui/icons";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";


export default function DashboardLayout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF9]">
      {/* Desktop sidebar — fixed 250px, hidden below lg */}
      <aside className="hidden lg:flex lg:w-[250px] lg:shrink-0 lg:flex-col border-r border-[#E7E5E4]">
        <DashboardSidebar />
      </aside>

      {/* Mobile drawer sidebar */}
      <Drawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} placement="left" size="xs">
        <DrawerContent>
          <DrawerBody className="p-0">
            <DashboardSidebar onNavigate={() => setIsDrawerOpen(false)} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile top bar — hamburger only */}
        <header className="flex items-center gap-3 border-b border-[#E7E5E4] bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-md p-2 text-[#1C1917] hover:bg-[#F97316]/10"
            aria-label="Open menu"
          >
            <Bars width={22} height={22} />
          </button>
          <span className="font-bold text-[#1C1917]">
            <span className="text-[#F97316]">ReSell</span>Hub
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}