import ItemDetailClient from "@/features/item/ui/ItemDetailClient";
import { supabaseServer } from "@/shared/api/supabase-server";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;

  const { data: item, error } = await supabaseServer
    .from("items_info")
    .select("id, name, item_gender, image, category, item_source")
    .eq("id", itemId)
    .single();

  if (error || !item) {
    return <div>존재하지 않는 아이템입니다.</div>;
  }

  return (
    <section>
      <ItemDetailClient item={item} />
    </section>
  );
}
