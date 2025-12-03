import ItemList from "@/features/items/ui/ItemList";
import { ItemCategory } from "@/features/item/model/itemTypes";
import { ITEM_CATEGORY_MAP } from "@/shared/config/constants";
import SectionTitle from "@/shared/ui/SectionTitle";

export default async function ItemCategoryPage({
  params,
}: {
  params: Promise<{ category: ItemCategory }>;
}) {
  const { category } = await params;
  return (
    <section className="w-full lg:max-w-6xl mx-auto">
      <SectionTitle>
        <b className="text-blue-600 inline-block mr-2">
          {ITEM_CATEGORY_MAP[category]}
        </b>
        아이템 판매/구매 목록
      </SectionTitle>

      <div className="flex gap-4">
        {/* 팝니다 */}
        <div className="w-[50%]">
          <h3 className="md:text-lg font-bold mb-2 text-base">판매해요</h3>
          <ItemList category={category} isForSale={true} isSold={false} />
        </div>

        {/* 삽니다 */}
        <div className="w-[50%]">
          <h3 className="md:text-lg font-bold mb-2 text-base">구매해요</h3>
          <ItemList category={category} isForSale={false} isSold={false} />
        </div>
      </div>
    </section>
  );
}
