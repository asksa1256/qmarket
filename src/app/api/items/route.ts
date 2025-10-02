import { NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase-server";
import { nanoid } from "nanoid";
import crypto from "crypto"; // Secret Key 생성용
import {
  ANON_USERS_TABLE_NAME,
  ITEMS_TABLE_NAME,
} from "@/shared/config/constants";

// 비밀 키 생성 함수
const generateSecretKey = () => {
  return crypto.randomBytes(16).toString("hex"); // 32자리 16진수 문자열
};

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const { searchParams } = req.url
      ? url
      : { searchParams: new URLSearchParams() };
    const limit = Number(url.searchParams.get("limit") ?? 10);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const search = searchParams.get("search") || "";

    const query = supabaseServer
      .from("items")
      .select(
        "id, item_name, price, image, is_online, item_source, nickname, is_sold"
      )
      .order("id", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) query.ilike("item_name", `%${search}%`);

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
    // 비인증 사용자용
    const anonId = nanoid();
    const secretKey = generateSecretKey();
    const createdAt = new Date().toISOString();

    const { error: userError } = await supabaseServer
      .from(ANON_USERS_TABLE_NAME)
      .insert({
        anon_id: anonId,
        secret_key: secretKey,
        created_at: createdAt,
      });

    if (userError) throw userError;

    const { data: item, error: itemError } = await supabaseServer
      .from(ITEMS_TABLE_NAME)
      .insert({
        item_name,
        price,
        anon_user_id: anonId,
      })
      .select("id")
      .single();

    if (itemError) throw itemError;

    return NextResponse.json({
      success: true,
      item_id: item.id,
      secret_key: secretKey,
      message:
        "상품이 등록되었습니다. Secret Key를 반드시 보관해주세요! Secret Key가 없으면 상품을 수정할 수 없습니다.",
    });
  } catch (error) {
    console.error("상품 등록 에러:", error);
    return NextResponse.json(
      { error: "서버 오류로 등록에 실패했습니다." },
      { status: 500 }
    );
  }
}
