"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/infrastructure/context/AuthContext";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/auth/login");
      }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <div className="text-white">Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
