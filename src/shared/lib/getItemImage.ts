import { supabase } from "../api/supabase-client";

export default async function getItemImage(
  itemName: string,
  itemGender: string
): Promise<string> {
  const { data, error } = await supabase
    .from("items_info")
    .select("image")
    .eq("name", itemName)
    .eq("item_gender", itemGender);

  if (error) {
    console.error("아이템 이미지 조회 오류: ", error);
    return "";
  }

  if (data && data.length > 0) {
    return data[0].image;
  }

  return "";
}
