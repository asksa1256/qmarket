import { getSupabaseClientCookie } from "@/shared/api/supabase-cookie";

interface Props {
  itemName: string;
  userId: string;
}

export default async function preventCreateExistingItem({
  itemName,
  userId,
}: Props) {
  const supabase = await getSupabaseClientCookie();

  const { data: existingItems, error: selectError } = await supabase
    .from("items_test")
    .select("user_id")
    .eq("item_name", itemName)
    .eq("user_id", userId);

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (existingItems && existingItems.length > 0) {
    throw new Error("이미 판매중인 아이템은 등록하실 수 없습니다.");
  }
}
