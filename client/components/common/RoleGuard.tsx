"use client";

import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { usePermission } from "@/hooks/usePermission";
import type { Role } from "@/types/enums";

interface RoleGuardProps {
  roles: Role[];
  children: ReactNode;
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { hasRole } = usePermission();

  if (hasRole(...roles)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <EmptyState
        icon={ShieldAlert}
        title="Access denied"
        description="You do not have permission to view this workspace."
      />
    </div>
  );
}
