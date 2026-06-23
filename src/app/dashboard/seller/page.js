"use client";

import { Card } from "@heroui/react";
import { Box, ChartLine, CircleDollar, Clock } from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";

// Hardcoded for now — wire to real fetch later
const STATS = [
  { label: "Total Products", value: 0, icon: Box, color: "#F97316" },
  { label: "Total Sales", value: 0, icon: ChartLine, color: "#3B5BDB" },
  { label: "Revenue", value: "$0", icon: CircleDollar, color: "#16A34A" },
  { label: "Pending Orders", value: 0, icon: Clock, color: "#D97706" },
];

export default function DashboardOverviewPage() {
  const { data: session } = useSession();
  const name = session?.user?.name || "there";

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1C1917]">Welcome back, {name}</h1>
      <p className="mt-1 text-sm text-[#78716C]">
        Here&apos;s a quick look at how your store is doing.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border border-[#E7E5E4] shadow-sm">
            <Card.Content className="flex flex-row items-center gap-4 p-5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}1A` }}
              >
                <Icon width={22} height={22} style={{ color }} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#78716C]">{label}</span>
                <span className="text-xl font-bold text-[#1C1917]">{value}</span>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}