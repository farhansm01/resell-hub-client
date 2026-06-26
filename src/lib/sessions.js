// In useRoleGuard.js
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // add usePathname
import { useSession } from "@/lib/auth-client";

export function useRoleGuard(allowedRole) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // add this

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      // Only redirect to signin if still inside a dashboard route
      if (pathname.startsWith("/dashboard")) {
        router.replace("/signin");
      }
      return;
    }

    if (session.user?.role !== allowedRole) {
      router.replace(`/dashboard/${session.user?.role}`);
    }
  }, [session, isPending, allowedRole, router, pathname]); // add pathname

  return { session, isLoading: isPending || session?.user?.role !== allowedRole };
}