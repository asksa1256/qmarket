import { ItemCategory } from "@/features/item/model/itemTypes";
import { ITEM_CATEGORY_MAP } from "@/shared/config/constants";
import SectionTitle from "@/shared/ui/SectionTitle";
import {
  getRegItemsByCategory,
  getItemCategories,
} from "@/features/items/model/getRegItemsByCategory";
import CategoryItemAccordion from "@/features/items/ui/CategoryItemAccordion";
import CategoryItemFilteredList from "@/features/items/ui/CategoryItemFilteredList";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";

export async function generateStaticParams() {
  const categories = await getItemCategories();

  return categories.map((category) => ({
    category: category,
  }));
}

export default async function ItemCategoryPage({
  params,
}: {
  params: Promise<{ category: ItemCategory }>;
}) {
  const { category } = await params;
  const maleItems = await getRegItemsByCategory(category, "m");
  const femaleItems = await getRegItemsByCategory(category, "w");

  const items = {
    male: maleItems,
    female: femaleItems,
  };

  return (
    <section className="w-full lg:max-w-6xl mx-auto">
      <ButtonToBack />

      <SectionTitle>
        <b className="text-blue-600 inline-block mr-2">
          {ITEM_CATEGORY_MAP[category]}
        </b>
        판매/구매 목록
      </SectionTitle>

      <CategoryItemFilteredList category={category} />

      {/* 카테고리별 아이템 전체 목록 */}
      <div className="mt-8">
        <SectionTitle>{ITEM_CATEGORY_MAP[category]} 전체</SectionTitle>
        <CategoryItemAccordion items={items} />
      </div>
    </section>
  );
}
