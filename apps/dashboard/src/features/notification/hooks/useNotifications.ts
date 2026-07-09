import type { Notification } from "@restaurant-pos/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "../services/notification.service";

export function useNotifications(page = 1, pageSize = 20) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications", page, pageSize],
    queryFn: () => fetchNotifications(page, pageSize),
  });

  useSocketEvent<Notification>("notification:new", (notification) => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    toast(notification.title, { description: notification.message });
  });

  return query;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
