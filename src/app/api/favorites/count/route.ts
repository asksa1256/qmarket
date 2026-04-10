import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase-server";

export async function GET(request: NextRequest) {
  const itemInfoId = request.nextUrl.searchParams.get("itemInfoId");

  if (!itemInfoId) {
    return NextResponse.json({ error: "Missing itemInfoId" }, { status: 400 });
  }

  const { count, error } = await supabaseServer
    .from("item_favorites")
    .select("*", { count: "exact", head: true })
    .eq("item_info_id", itemInfoId);

  if (error) {
    console.error("찜 수 조회 실패:", error);
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}
