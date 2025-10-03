import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase-server";
import { nanoid } from "nanoid";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const { searchParams } = req.url
      ? url
      : { searchParams: new URLSearchParams() };
    const limit = Number(url.searchParams.get("limit") ?? 10);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort");

    let query = supabaseServer
      .from("items")
      .select(
        "id, item_name, price, image, is_online, item_source, nickname, is_sold"
      )
      .range(offset, offset + limit - 1);

    if (search) query.ilike("item_name", `%${search}%`);

    // 정렬
    if (!sort) {
      // 기본 정렬: 최신순 (id 내림차순)
      query = query.order("id", { ascending: false });
    }
    if (sort === "price_asc") {
      query = query.order("price", { ascending: true });
    }
    if (sort === "price_desc") {
      query = query.order("price", { ascending: false });
    }

    const { data, error } = await query;

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
};

export async function POST(request: Request) {
  const { item_name, price } = await request.json();

  if (!item_name || !price) {
    return NextResponse.json(
      { error: "상품명과 가격을 입력해주세요." },
      { status: 400 }
    );
  }

  try {
    const { data: item, error: itemError } = await supabaseServer
      .from(ITEMS_TABLE_NAME)
      .insert({
        item_name,
        price,
      })
      .select("id")
      .single();

    if (itemError) throw itemError;

    return NextResponse.json({
      success: true,
      item_id: item.id,
    });
  } catch (error) {
    console.error("상품 등록 에러:", error);
    return NextResponse.json(
      { error: "서버 오류로 등록에 실패했습니다." },
      { status: 500 }
    );
  }
}
