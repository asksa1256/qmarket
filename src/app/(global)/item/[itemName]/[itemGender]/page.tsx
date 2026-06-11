import ItemDetailClient from "@/features/item/ui/ItemDetailClient";
import { supabaseServer } from "@/shared/api/supabase-server";
import RequestItemModal from "@/features/item/ui/RequestItemModal";
import { getItemMarketPrice } from "@/features/item/model/getItemMarketPrice";
import getDesiredPrice from "@/features/item/model/getDesiredPrice";
import type { Metadata } from "next";
import { ITEM_GENDER_MAP } from "@/shared/config/constants";

type PageProps = {
  params: Promise<{ itemName: string; itemGender: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { itemName, itemGender } = await params;
  const decodedName = decodeURIComponent(itemName);
  const decodedGender = decodeURIComponent(itemGender);
  const genderLabel = ITEM_GENDER_MAP[decodedGender as keyof typeof ITEM_GENDER_MAP] ?? decodedGender;

  const { data: item } = await supabaseServer
    .from("items_info")
    .select("image")
    .eq("name", decodedName)
    .eq("item_gender", decodedGender)
    .single();

  const title = `${decodedName} (${genderLabel})`;
  const description = `${decodedName} (${genderLabel}) 아이템 시세, 거래 현황, 상세 정보 - Q-Market`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(item?.image && { images: [{ url: item.image }] }),
    },
    twitter: {
      card: item?.image ? "summary_large_image" : "summary",
      title,
      description,
      ...(item?.image && { images: [item.image] }),
    },
  };
}

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
  const desiredPrice = await getDesiredPrice(
    decodedItemName,
    decodedItemGender
  );

  const { data: item, error } = await supabaseServer
    .from("items_info")
    .select(
      "id, name, item_gender, image, category, item_source, rotation_date, rotation_degree, shop_price, shop_price_type"
    )
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
      {item && (
        <ItemDetailClient
          item={item}
          marketPrice={marketPrice.price}
          desiredPrice={desiredPrice}
        />
      )}
    </section>
  );
}
