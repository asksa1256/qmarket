import { supabaseServer } from "@/shared/api/supabase-server";
import type {
  NotificationItem,
  NotificationsResponse,
} from "@/features/notification/model/notificationTypes";

interface CreateNotificationInput {
  user_id: string;
  type: string;
  message: string;
  link_url: string;
  item_id: number | null;
  item_name: string | null;
  item_gender: string | null;
}

interface StoredNotification extends NotificationItem {
  user_id: string;
}

interface NotificationMemoryState {
  nextId: number;
  notifications: StoredNotification[];
}

const TABLE_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

function isMemoryStore() {
  return process.env.NOTIFICATION_STORE === "memory";
}

function getNotificationTableName() {
  const tableName = process.env.NOTIFICATIONS_TABLE_NAME?.trim();

  if (!tableName) {
    return "notifications";
  }

  if (!TABLE_NAME_PATTERN.test(tableName)) {
    console.warn("Invalid NOTIFICATIONS_TABLE_NAME. Falling back to notifications.");
    return "notifications";
  }

  return tableName;
}

function getMemoryState() {
  const globalScope = globalThis as typeof globalThis & {
    __qmarketNotificationMemoryState?: NotificationMemoryState;
  };

  if (!globalScope.__qmarketNotificationMemoryState) {
    globalScope.__qmarketNotificationMemoryState = {
      nextId: 1,
      notifications: [],
    };
  }

  return globalScope.__qmarketNotificationMemoryState;
}

function toNotificationItem(
  notification: StoredNotification
): NotificationItem {
  return {
    id: notification.id,
    type: notification.type,
    message: notification.message,
    link_url: notification.link_url,
    item_id: notification.item_id,
    item_name: notification.item_name,
    item_gender: notification.item_gender,
    is_read: notification.is_read,
    created_at: notification.created_at,
    read_at: notification.read_at,
  };
}

export async function createNotifications(
  inputs: CreateNotificationInput[]
) {
  if (inputs.length === 0) return;

  if (isMemoryStore()) {
    const state = getMemoryState();
    const createdAt = new Date().toISOString();

    state.notifications.unshift(
      ...inputs.map((input) => ({
        ...input,
        id: state.nextId++,
        is_read: false,
        read_at: null,
        created_at: createdAt,
      }))
    );
    return;
  }

  const { error } = await supabaseServer
    .from(getNotificationTableName())
    .insert(inputs);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getNotificationsForUser(
  userId: string,
  limit: number
): Promise<NotificationsResponse> {
  if (isMemoryStore()) {
    const notifications = getMemoryState()
      .notifications.filter((notification) => notification.user_id === userId)
      .slice(0, limit)
      .map(toNotificationItem);

    const unreadCount = getMemoryState().notifications.filter(
      (notification) => notification.user_id === userId && !notification.is_read
    ).length;

    return { notifications, unreadCount };
  }

  const tableName = getNotificationTableName();
  const [{ data: notifications, error }, { count, error: countError }] =
    await Promise.all([
      supabaseServer
        .from(tableName)
        .select(
          "id, type, message, link_url, item_id, item_name, item_gender, is_read, created_at, read_at"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit),
      supabaseServer
        .from(tableName)
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false),
    ]);

  if (error || countError) {
    throw new Error(
      error?.message ?? countError?.message ?? "Failed to fetch notifications."
    );
  }

  return {
    notifications: (notifications as NotificationItem[] | null) ?? [],
    unreadCount: count ?? 0,
  };
}

export async function markNotificationsAsRead(userId: string) {
  if (isMemoryStore()) {
    const readAt = new Date().toISOString();

    getMemoryState().notifications.forEach((notification) => {
      if (notification.user_id === userId && !notification.is_read) {
        notification.is_read = true;
        notification.read_at = readAt;
      }
    });
    return;
  }

  const { error } = await supabaseServer
    .from(getNotificationTableName())
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteNotification(userId: string, notificationId: number) {
  if (isMemoryStore()) {
    const state = getMemoryState();
    state.notifications = state.notifications.filter(
      (notification) =>
        notification.user_id !== userId || notification.id !== notificationId
    );
    return;
  }

  const { error } = await supabaseServer
    .from(getNotificationTableName())
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}
