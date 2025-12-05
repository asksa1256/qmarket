import ItemDetailClient from "@/features/item/ui/ItemDetailClient";
import { supabaseServer } from "@/shared/api/supabase-server";
import RequestItemModal from "@/features/item/ui/RequestItemModal";
import { getItemMarketPrice } from "@/features/item/model/getItemMarketPrice";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ itemName: string; itemGender: string }>;
}) {
  const { itemName, itemGender } = await params;
  const decodedItemName = decodeURIComponent(itemName);
  const decodedItemGender = decodeURIComponent(itemGender);
  const marketPrice = await getItemMarketPrice(
    decodedItemName,
    decodedItemGender
  );

  const { data: item, error } = await supabaseServer
    .from("items_info")
    .select("id, name, item_gender, image, category, item_source")
    .eq("name", decodedItemName)
    .eq("item_gender", decodedItemGender)
    .single();

  return (
    <section className="lg:max-w-6xl mx-auto">
      {(error || !item) && (
        <div className="flex flex-col gap-4 items-center justify-center h-[300px]">
          <p className="text-foreground/50">
            존재하지 않거나 아직 등록되지 않은 아이템입니다.
          </p>
          <RequestItemModal
            itemName={decodedItemName}
            itemGender={decodedItemGender}
          />
        </div>
      )}
      {item && <ItemDetailClient item={item} marketPrice={marketPrice.price} />}
    </section>
  );
}
