"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const initials = user ? getInitials(user.fullName ?? user.email) : "??";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/80 backdrop-blur-sm px-4">
      {/* Mobile nav trigger */}
      <MobileNav />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {/* Unread dot — wired up in Phase 10 */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
        </Button>

        {/* Theme toggle — desktop only (sidebar has it too) */}
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>

        {/* Avatar → profile */}
        <Link href={ROUTES.PROFILE} aria-label="My profile">
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}