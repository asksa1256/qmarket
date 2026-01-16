import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase-server";
import {
  ITEMS_TABLE_NAME,
  SELECT_ITEM_COLUMNS,
  ITEM_CATEGORY_MAP,
  ITEM_GENDER_MAP,
} from "@/shared/config/constants";

type ItemCategoryKey = keyof typeof ITEM_CATEGORY_MAP;
type ItemGenderKey = keyof typeof ITEM_GENDER_MAP;

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
    const category = searchParams.get("category") as ItemCategoryKey;
    const gender = searchParams.get("gender") as ItemGenderKey;
    const sold = searchParams.get("sold");

    let query = supabaseServer
      .from(ITEMS_TABLE_NAME)
      // .from("items_test")
      .select(SELECT_ITEM_COLUMNS)
      .neq("nickname", "관리자")
      .neq("nickname", "큐마켓")
      .range(offset, offset + limit - 1);

    // 필터
    if (search) query.ilike("item_name", `%${search}%`);
    if (category) query.eq("category", ITEM_CATEGORY_MAP[category]);
    if (gender) query.eq("item_gender", ITEM_GENDER_MAP[gender]);
    if (sold) query.eq("is_sold", sold);

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
