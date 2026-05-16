"use client";

import { LogOut, User, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { useLogout } from "@/modules/auth/hooks/useLogout";
import { ROUTES } from "@/constants/routes";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarUserFooterProps {
  collapsed?: boolean;
}

export function SidebarUserFooter({ collapsed = false }: SidebarUserFooterProps) {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending } = useLogout();

  if (!user) return null;

  const initials = getInitials(user.fullName ?? user.email);
  const displayName = user.fullName ?? user.email;
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
            "hover:bg-sidebar-accent text-sidebar-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          )}
          aria-label="User menu"
        >
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{roleLabel}</p>
              </div>
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={ROUTES.PROFILE} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isPending}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}