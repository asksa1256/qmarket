import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase-server";
import { getSupabaseServerCookie } from "@/shared/api/supabase-cookie";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("item_favorites")
    .select("id, item_info_id, item_name, item_image, item_gender, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("찜 목록 불러오기 실패:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await getSupabaseServerCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemInfoId, itemName, itemImage, itemGender } = await request.json();

  if (!itemInfoId || !itemName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("item_favorites")
    .insert({
      user_id: user.id,
      item_info_id: itemInfoId,
      item_name: itemName,
      item_image: itemImage ?? null,
      item_gender: itemGender ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      // 이미 찜된 아이템 - 기존 레코드 반환
      const { data: existing } = await supabaseServer
        .from("item_favorites")
        .select()
        .eq("user_id", user.id)
        .eq("item_info_id", itemInfoId)
        .single();
      return NextResponse.json(existing);
    }
    console.error("찜 추가 실패:", error);
    return NextResponse.json({ error: "Failed to insert" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = await getSupabaseServerCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itemInfoId } = await request.json();

  if (!itemInfoId) {
    return NextResponse.json({ error: "Missing itemInfoId" }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from("item_favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("item_info_id", itemInfoId);

  if (error) {
    console.error("찜 삭제 실패:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
