"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/modules/auth/store/authStore";

/**
 * Syncs Zustand auth state to cookies so middleware can read the role/token
 * without access to localStorage (which is unavailable in Edge runtime).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { accessToken, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && accessToken && user) {
      // Write lightweight cookies for middleware to read
      document.cookie = `quickcred-auth-token=${accessToken}; path=/; SameSite=Lax`;
      document.cookie = `quickcred-auth-role=${user.role}; path=/; SameSite=Lax`;
    } else {
      // Clear cookies on logout
      document.cookie = "quickcred-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "quickcred-auth-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [accessToken, user, isAuthenticated]);

  return <>{children}</>;
}
