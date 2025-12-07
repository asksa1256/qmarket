import ItemList from "@/features/items/ui/ItemList";
import { ItemCategory } from "@/features/item/model/itemTypes";
import { ITEM_CATEGORY_MAP } from "@/shared/config/constants";
import SectionTitle from "@/shared/ui/SectionTitle";
import {
  getRegItemsByCategory,
  getItemCategories,
} from "@/features/items/model/getRegItemsByCategory";
import CategoryItemAccordion from "@/features/items/ui/CategoryItemAccordion";

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
    <section className="w-full lg:max-w-6xl mx-auto lg:px-0 px-4">
      <SectionTitle>
        <b className="text-blue-600 inline-block mr-2">
          {ITEM_CATEGORY_MAP[category]}
        </b>
        아이템 판매/구매 목록
      </SectionTitle>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* 판매해요 */}
        <div>
          <h3 className="md:text-lg font-bold mb-2 text-base">판매해요</h3>
          <ItemList category={category} isForSale={true} isSold={false} />
        </div>

        {/* 구매해요 */}
        <div>
          <h3 className="md:text-lg font-bold mb-2 text-base">구매해요</h3>
          <ItemList category={category} isForSale={false} isSold={false} />
        </div>
      </div>

      {/* 카테고리별 아이템 전체 목록 */}
      <div className="mt-8">
        <SectionTitle>{ITEM_CATEGORY_MAP[category]} 아이템 전체</SectionTitle>
        <CategoryItemAccordion items={items} />
      </div>
    </section>
  );
}
