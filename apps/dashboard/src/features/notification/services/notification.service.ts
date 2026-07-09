import type { ApiSuccessEnvelope, NotificationListResponse } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export async function fetchNotifications(page = 1, pageSize = 20) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<NotificationListResponse>>("/api/notifications", {
    params: { page, pageSize },
  });
  return data.data;
}

export async function markNotificationRead(id: string) {
  await apiClient.patch(`/api/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  await apiClient.patch("/api/notifications/read-all");
}
