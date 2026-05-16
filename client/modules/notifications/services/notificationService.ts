import apiClient from "@/lib/axios/client";
import type { ApiResponse } from "@/types/api.types";
import type {
  Notification,
  NotificationPage,
  ServerNotification,
} from "../types/notification.types";

interface ServerNotificationPage {
  notifications: ServerNotification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function normalizeNotification(notification: ServerNotification): Notification {
  return {
    _id: notification._id,
    userId: notification.recipientId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    read: notification.isRead,
    loanId: notification.loanId,
    createdAt: notification.createdAt,
  };
}

export const notificationService = {
  getAll: async (page = 1, limit = 20): Promise<NotificationPage> => {
    const { data } = await apiClient.get<ApiResponse<ServerNotificationPage>>(
      "/notifications",
      { params: { page, limit } }
    );

    return {
      ...data.data,
      notifications: data.data.notifications.map(normalizeNotification),
    };
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/read-all");
  },
};
