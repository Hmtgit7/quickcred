"use client";

import Link from "next/link";
import { ChevronUp, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/routes";
import { getInitials, cn } from "@/lib/utils";
import { useAuthStore } from "@/modules/auth/store/authStore";

interface SidebarUserFooterProps {
  collapsed?: boolean;
}

export function SidebarUserFooter({ collapsed = false }: SidebarUserFooterProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const initials = getInitials(user.fullName ?? user.email);
  const displayName = user.fullName ?? user.email;
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center rounded-lg transition-colors",
            "text-sidebar-foreground hover:bg-sidebar-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            collapsed ? "h-9 justify-center px-0" : "gap-3 px-3 py-2.5"
          )}
          aria-label="User menu"
        >
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
              </div>
              <ChevronUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
