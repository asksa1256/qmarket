import { supabase } from "@/shared/api/supabase-client";

export async function createItemRequest({
  itemName,
  gender,
  userId,
}: {
  itemName: string;
  gender: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("item_reg_request")
    .insert({
      item_name: itemName,
      item_gender: gender,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
