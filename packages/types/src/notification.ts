import type { NotificationType } from "./enums.js";

export interface Notification {
  id: string;
  outletId: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceType: string | null;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  pageSize: number;
}
