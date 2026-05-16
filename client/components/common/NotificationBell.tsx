"use client";

import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMarkRead } from "@/modules/notifications/hooks/useMarkRead";
import { useNotifications } from "@/modules/notifications/hooks/useNotifications";
import { NOTIF_ICON_MAP } from "./notifIconMap";

export function NotificationBell() {
  const { notifications, unreadCount, isLoading } = useNotifications();
  const { markOne, markAll, isMarkingAll } = useMarkRead();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span
              className="absolute right-1.5 top-1.5 flex h-2 w-2"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 sm:w-96" sideOffset={8}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => markAll()}
              disabled={isMarkingAll}
            >
              {isMarkingAll ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCheck />
              )}
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[22.5rem]">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">All caught up</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                No notifications yet
              </p>
            </div>
          )}

          {!isLoading && notifications.length > 0 && (
            <ul role="list">
              {notifications.map((notification, index) => {
                const Icon = NOTIF_ICON_MAP[notification.type] ?? Bell;

                return (
                  <li key={notification._id}>
                    <button
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50",
                        !notification.read && "bg-primary/5"
                      )}
                      onClick={() =>
                        !notification.read && markOne(notification._id)
                      }
                      aria-label={
                        notification.read
                          ? notification.title
                          : `Unread: ${notification.title}`
                      }
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          notification.read
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-sm leading-snug text-foreground",
                            notification.read ? "font-medium" : "font-semibold"
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-[10px] tabular-nums text-muted-foreground/70">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      {!notification.read && (
                        <div
                          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    {index < notifications.length - 1 && (
                      <Separator className="mx-4 w-auto" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
