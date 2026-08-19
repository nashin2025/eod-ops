"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });

  const isAuthenticated = !!user && !error;
  const isApproved = user?.approvalStatus === "approved";
  const isPendingApproval = isAuthenticated && !isApproved;

  return {
    user,
    isLoading,
    isAuthenticated,
    isApproved,
    isPendingApproval,
  };
}
