import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerCookie } from "@/shared/api/supabase-cookie";
import {
  deleteNotification,
  getNotificationsForUser,
  markNotificationsAsRead,
} from "@/features/notification/model/notificationStore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await getSupabaseServerCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 20, 1), 50);

  try {
    return NextResponse.json(await getNotificationsForUser(user.id, limit));
  } catch (error) {
    console.error("알림 조회 실패:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH() {
  const supabase = await getSupabaseServerCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await markNotificationsAsRead(user.id);
  } catch (error) {
    console.error("알림 읽음 처리 실패:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await getSupabaseServerCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notificationId = Number(request.nextUrl.searchParams.get("id"));

  if (!Number.isInteger(notificationId) || notificationId < 1) {
    return NextResponse.json({ error: "Invalid notification id" }, { status: 400 });
  }

  try {
    await deleteNotification(user.id, notificationId);
  } catch (error) {
    console.error("알림 삭제 실패:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
