"use client";

import Link from "next/link";
import { NotificationBell } from "@/components/common/NotificationBell";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes";
import { getInitials } from "@/lib/utils";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { MobileNav } from "./MobileNav";

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const initials = user ? getInitials(user.fullName ?? user.email) : "??";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <MobileNav />
      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <NotificationBell />

        <div className="hidden lg:block">
          <ThemeToggle />
        </div>

        <Link href={ROUTES.PROFILE} aria-label="My profile">
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary/30">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
