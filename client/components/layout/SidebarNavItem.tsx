"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed?: boolean;
  onClick?: () => void;
  badge?: number;
}

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  collapsed = false,
  onClick,
  badge,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  const content = (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive
          ? "bg-sidebar-accent text-sidebar-primary font-semibold"
          : "text-sidebar-foreground/70"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50"
        )}
      />
      {!collapsed && (
        <span className="truncate">{label}</span>
      )}
      {!collapsed && badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {label}
            {badge !== undefined && badge > 0 && (
              <span className="text-xs text-muted-foreground">({badge})</span>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}