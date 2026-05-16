import { create } from "zustand";
import type { Notification } from "../types/notification.types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[], unreadCount?: number) => void;
  markOneRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications, unreadCount) =>
    set({
      notifications,
      unreadCount:
        unreadCount ?? notifications.filter((notification) => !notification.read).length,
    }),

  markOneRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      );

      return {
        notifications,
        unreadCount: notifications.filter((notification) => !notification.read)
          .length,
      };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
      unreadCount: 0,
    })),
}));
