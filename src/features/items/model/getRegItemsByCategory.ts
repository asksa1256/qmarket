import { ITEM_CATEGORY_MAP, ITEM_GENDER_MAP } from "@/shared/config/constants";
import { ItemCategory, ItemGender } from "@/features/item/model/itemTypes";
import { ItemSimple } from "@/features/item/ui/ItemBar";

export async function getRegItemsByCategory(
  category: ItemCategory,
  item_gender: ItemGender
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/items_info?` +
      new URLSearchParams({
        select: "id,name,item_gender,image,category",
        category: `eq.${ITEM_CATEGORY_MAP[category]}`,
        item_gender: `eq.${ITEM_GENDER_MAP[item_gender]}`,
        order: "name.asc",
      }),
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      next: { revalidate: 60 * 60 * 24 }, // ISR, 24시간
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch items_info by category");
  }

  const data = await res.json();

  return data.map((item: ItemSimple) => ({
    ...item,
    image: item.image ? item.image.trim() : null,
  }));
}

// generateStaticParams에서 사용할 함수
export async function getItemCategories() {
  return Object.keys(ITEM_CATEGORY_MAP) as ItemCategory[];
}
