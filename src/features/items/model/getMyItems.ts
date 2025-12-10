"use client";

import { supabase } from "@/shared/api/supabase-client";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";

export const getMyItems = async (userId: string) => {
  const { data, error } = await supabase
    .from(ITEMS_TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("내 아이템 로딩 오류:", error);
    throw new Error(error.message);
  }
  return data;
};
