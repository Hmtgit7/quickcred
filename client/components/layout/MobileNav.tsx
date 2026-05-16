"use client";

import { useUiStore } from "@/store/uiStore";
import { usePermission } from "@/hooks/usePermission";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarUserFooter } from "./SidebarUserFooter";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import { NAV_ITEMS } from "./navConfig";
import { APP_NAME } from "@/constants/app.constants";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function MobileNav() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const permission = usePermission();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles ? permission.hasRole(...item.roles) : true
  );

  const closeNav = () => setMobileSidebarOpen(false);

  return (
    <>
      {/* Hamburger trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-9 w-9"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Drawer */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
          <SheetHeader className="flex h-14 flex-row items-center justify-start px-4 border-b border-sidebar-border space-y-0">
            <SheetTitle asChild>
              <Link
                href={ROUTES.DASHBOARD}
                onClick={closeNav}
                className="flex items-center gap-2.5"
                aria-label={APP_NAME}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
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
                <span className="font-semibold text-sm text-sidebar-foreground">{APP_NAME}</span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-2 py-3 h-[calc(100dvh-7rem)]">
            <nav aria-label="Mobile navigation">
              <ul className="space-y-0.5">
                {visibleItems.map((item) => (
                  <li key={item.href}>
                    <SidebarNavItem
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      onClick={closeNav}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea>

          <div className="px-2 pb-4 border-t border-sidebar-border pt-2 space-y-1">
            <div className="px-1">
              <ThemeToggle className="w-full justify-start gap-3 text-sidebar-foreground/70" />
            </div>
            <SidebarUserFooter />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
