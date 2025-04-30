"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!loading && !user && path !== "/login" && path !== "/register") {
      router.replace("/login");
    }
  }, [user, loading, path, router]);

  if (loading || (!user && path !== "/login" && path !== "/register")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
