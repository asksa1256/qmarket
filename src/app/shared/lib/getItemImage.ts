import { supabase } from "../api/supabase-client";

export default async function getItemImage(
  itemName: string,
  itemGender: string
): Promise<string> {
  const { data, error } = await supabase
    .from("items")
    .select("image")
    .eq("item_name", itemName)
    .eq("item_gender", itemGender);

  if (error) {
    console.error("아이템 이미지 조회 오류: ", error);
    return "";
  }

  if (data && data.length > 0 && typeof data[0].image === "string") {
    return data[0].image;
  }

  return "";
}
