"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

/**
 * Guards a dashboard route by role.
 * - No session -> redirect to /login
 * - Session exists but role doesn't match -> redirect to their own dashboard
 * - Matching role -> just returns session + isLoading, page renders normally
 *
 * Usage in a role layout:
 *   const { session, isLoading } = useRoleGuard("seller");
 *   if (isLoading) return <Spinner />;
 */
export function useRoleGuard(allowedRole) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return; // wait for session to resolve before deciding anything

    if (!session) {
      router.replace("/login");
      return;
    }

    if (session.user?.role !== allowedRole) {
      router.replace(`/dashboard/${session.user?.role}`);
    }
  }, [session, isPending, allowedRole, router]);

  return { session, isLoading: isPending || session?.user?.role !== allowedRole };
}