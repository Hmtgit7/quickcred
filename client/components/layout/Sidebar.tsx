"use client";

import { useUiStore } from "@/store/uiStore";
import { usePermission } from "@/hooks/usePermission";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarUserFooter } from "./SidebarUserFooter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/routes";
import { NAV_ITEMS } from "./navConfig";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const permission = usePermission();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles ? permission.hasRole(...item.roles) : true
  );

  return (
    <aside
      className={cn(
        "group/sidebar hidden lg:flex flex-col h-screen sticky top-0",
        "bg-sidebar border-r border-sidebar-border",
        "transition-all duration-300 ease-in-out shrink-0",
        sidebarOpen ? "w-60" : "w-[60px]"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-sidebar-border shrink-0">
        {sidebarOpen && (
          <Link
            href={ROUTES.DASHBOARD}
            className="flex items-center gap-2 min-w-0"
            aria-label={APP_NAME}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M12 2L4 7v5c0 5 4 9.5 8 11 4-1.5 8-6 8-11V7L12 2z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-semibold text-sm truncate text-sidebar-foreground">
              {APP_NAME}
            </span>
          </Link>
        )}

        {!sidebarOpen && (
          <div className="relative mx-auto flex h-8 w-8 items-center justify-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary transition-opacity duration-150 group-hover/sidebar:opacity-0">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M12 2L4 7v5c0 5 4 9.5 8 11 4-1.5 8-6 8-11V7L12 2z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-0 h-8 w-8 text-sidebar-foreground/70 opacity-0 transition-opacity duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground group-hover/sidebar:opacity-100 focus-visible:opacity-100"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        )}

        {sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav aria-label="Main navigation">
          <ul className="space-y-0.5">
            {visibleItems.map((item) => (
              <li key={item.href}>
                <SidebarNavItem
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  collapsed={!sidebarOpen}
                />
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="shrink-0 px-2 pb-3 space-y-1">
        <Separator className="mb-2 bg-sidebar-border" />
        <SidebarUserFooter collapsed={!sidebarOpen} />
      </div>
    </aside>
  );
}
