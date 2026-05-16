"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/modules/auth/store/authStore";
import type { Role } from "@/types/enums";

interface RoleGuardProps {
  roles: Role[];
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

export function RoleGuard({
  roles,
  children,
  redirectTo,
  fallback,
}: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const hasAccess = Boolean(user && roles.includes(user.role));

  useEffect(() => {
    if (user && !hasAccess && redirectTo) {
      router.replace(redirectTo);
    }
  }, [hasAccess, redirectTo, router, user]);

  if (!user) return null;
  if (hasAccess) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  if (redirectTo) return null;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <ShieldOff className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Access denied</h2>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          You do not have permission to view this workspace.
        </p>
      </div>
      <Button
        type="button"
        variant="link"
        className="h-auto p-0"
        onClick={() => router.replace(ROUTES.DASHBOARD)}
      >
        Return to dashboard
      </Button>
    </div>
  );
}
