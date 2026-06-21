export interface NotificationItem {
  id: number;
  type: "favorite_item_listed" | string;
  message: string;
  link_url: string;
  item_id: number | null;
  item_name: string | null;
  item_gender: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}
