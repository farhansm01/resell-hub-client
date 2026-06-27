// src/lib/sessions.js
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function useRoleGuard(allowedRole) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      // Not logged in — send to signin
      if (pathname.startsWith("/dashboard")) {
        router.replace("/signin");
      }
      return;
    }

    if (session.user?.role !== allowedRole) {
      // Logged in but wrong role — send to unauthorized
      router.replace("/unauthorized");
    }
  }, [session, isPending, allowedRole, router, pathname]);

  return { session, isLoading: isPending || session?.user?.role !== allowedRole };
}