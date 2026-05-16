"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { notificationService } from "../services/notificationService";
import { useNotificationStore } from "../store/notificationStore";

export function useMarkRead() {
  const queryClient = useQueryClient();
  const markOneRead = useNotificationStore((state) => state.markOneRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);

  const markOne = useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onMutate: (id) => markOneRead(id),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.MY(1) }),
  });

  const markAll = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onMutate: () => markAllRead(),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.MY(1) }),
  });

  return {
    markOne: markOne.mutate,
    markAll: markAll.mutate,
    isMarkingAll: markAll.isPending,
  };
}
