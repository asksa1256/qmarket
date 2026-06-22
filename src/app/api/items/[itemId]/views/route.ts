import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase-server";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function POST(_: Request, { params }: RouteContext) {
  const { itemId } = await params;

  const { data: viewCount, error } = await supabaseServer.rpc(
    "increment_item_view_count",
    { p_item_id: itemId }
  );

  if (error) {
    console.error("Failed to increment item view count:", error);
    return NextResponse.json(
      { error: "Failed to record item view" },
      { status: 500 }
    );
  }

  if (viewCount === null) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(
    { viewCount },
    { headers: { "Cache-Control": "no-store" } }
  );
}
