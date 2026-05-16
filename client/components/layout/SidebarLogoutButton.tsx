"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLogout } from "@/modules/auth/hooks/useLogout";

interface SidebarLogoutButtonProps {
  collapsed?: boolean;
}

export function SidebarLogoutButton({ collapsed = false }: SidebarLogoutButtonProps) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button
      type="button"
      variant="ghost"
      size={collapsed ? "icon" : "default"}
      className={cn(
        "w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
        collapsed ? "h-9" : "justify-start gap-3 px-3"
      )}
      onClick={() => logout()}
      disabled={isPending}
      aria-label="Sign out"
    >
      <LogOut className="h-4 w-4" />
      {!collapsed && <span>{isPending ? "Signing out..." : "Sign out"}</span>}
    </Button>
  );
}
