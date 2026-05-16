"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { notificationService } from "../services/notificationService";
import { useNotificationStore } from "../store/notificationStore";

export function useNotifications() {
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const query = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.MY(1),
    queryFn: () => notificationService.getAll(1, 20),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setNotifications(query.data.notifications, query.data.unreadCount);
    }
  }, [query.data, setNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
