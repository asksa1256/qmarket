import { getSupabaseClientCookie } from "@/shared/api/supabase-cookie";

interface Props {
  itemName: string;
  itemGender: string;
  isForSale: boolean;
  userId: string;
}

export default async function preventCreateExistingItem({
  itemName,
  itemGender,
  isForSale,
  userId,
}: Props) {
  const supabase = await getSupabaseClientCookie();

  const { data: existingItems, error: selectError } = await supabase
    .from("items_test")
    .select("user_id")
    .eq("item_name", itemName)
    .eq("item_gender", itemGender)
    .eq("is_for_sale", isForSale)
    .eq("user_id", userId);

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (existingItems && existingItems.length > 0) {
    throw new Error("이미 등록하신 아이템입니다.");
  }
}
