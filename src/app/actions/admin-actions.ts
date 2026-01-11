"use server";

import { getUserServer } from "@/shared/api/get-supabase-user-server";
import { supabaseServer } from "@/shared/api/supabase-server";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";

export async function checkIsAdmin() {
  const user = await getUserServer();

  if (!user) {
    return false;
  }

  return user.id === process.env.ADMIN_USER_ID;
}

interface AdminDirectPriceFormValues {
  item_name: string;
  item_gender: string;
  item_source: string;
  category: string;
  image: string;
  price: number;
  is_sold: boolean;
  created_at: string;
}

export async function createAdminPrice(values: AdminDirectPriceFormValues) {
  const user = await getUserServer();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { data, error } = await supabaseServer
    .from(ITEMS_TABLE_NAME)
    // .from("items_test")
    .insert([
      {
        ...values,
        updated_at: values.created_at,
        nickname: "큐마켓",
        user_id: user.id,
        // is_for_sale은 일부러 채우지 않음 (목록에 관리자 데이터 뜨지 않게 하기 위함)
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
