"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useSession } from "@/lib/auth-client";

// Hit by anything that links to plain /dashboard (e.g. post-login redirect)
// Sends the user straight to their role-specific dashboard.
export default function DashboardIndexRedirect() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    router.replace(`/dashboard/${session.user?.role}`);
  }, [session, isPending, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#FAFAF9]">
      <Spinner />
    </div>
  );
}