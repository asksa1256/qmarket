"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationsResponse } from "@/features/notification/model/notificationTypes";

export const notificationsQueryKey = ["notifications"];

export function useNotifications(enabled: boolean) {
  return useQuery<NotificationsResponse>({
    queryKey: notificationsQueryKey,
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("알림을 불러오지 못했습니다.");
      return res.json();
    },
    enabled,
    staleTime: 30 * 1000,
    refetchInterval: enabled ? 60 * 1000 : false,
  });
}

export function useMarkNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (!res.ok) throw new Error("알림 읽음 처리에 실패했습니다.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: number) => {
      const res = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("알림 삭제에 실패했습니다.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
}
