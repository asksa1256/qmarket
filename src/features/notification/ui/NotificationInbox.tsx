"use client";

import Link from "next/link";
import { Bell, Trash2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { formatDate } from "@/shared/lib/formatters";
import {
  useDeleteNotification,
  useMarkNotificationsAsRead,
  useNotifications,
} from "@/features/notification/model/useNotifications";

interface NotificationInboxProps {
  user: User | null | undefined;
}

export default function NotificationInbox({ user }: NotificationInboxProps) {
  const { data, isLoading } = useNotifications(!!user);
  const markAsRead = useMarkNotificationsAsRead();
  const deleteNotification = useDeleteNotification();
  const unreadCount = data?.unreadCount ?? 0;
  const notifications = data?.notifications ?? [];

  if (!user) return null;

  const handleOpenChange = (open: boolean) => {
    if (open && unreadCount > 0 && !markAsRead.isPending) {
      markAsRead.mutate();
    }
  };

  return (
    <DropdownMenu modal={false} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          title="알림 보관함"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 min-w-4 h-4 rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-4 text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(360px,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0">알림 보관함</DropdownMenuLabel>
          {unreadCount > 0 && (
            <span className="text-xs font-medium text-blue-600">
              새 알림 {unreadCount}
            </span>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-[420px] overflow-y-auto">
          {isLoading ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              알림을 불러오는 중입니다.
            </p>
          ) : notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              아직 도착한 알림이 없습니다.
            </p>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex flex-col gap-2 px-3 py-3"
                >
                  <div className="flex items-start gap-2">
                    {!notification.is_read && (
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-5 text-foreground">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Button asChild variant="outline" size="sm" className="h-8">
                      <Link href={notification.link_url}>바로가기</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-red-600"
                      title="알림 삭제"
                      aria-label="알림 삭제"
                      disabled={deleteNotification.isPending}
                      onClick={() => deleteNotification.mutate(notification.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
