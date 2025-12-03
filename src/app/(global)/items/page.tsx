import ItemList from "@/features/items/ui/ItemList";
import SectionTitle from "@/shared/ui/SectionTitle";

export default function ItemsPage() {
  return (
    <section className="w-full lg:max-w-6xl mx-auto">
      <SectionTitle>판매/구매 현황</SectionTitle>

      <div className="flex gap-4">
        {/* 팝니다 */}
        <div className="w-[50%]">
          <h3 className="md:text-lg font-bold mb-2 text-base">판매해요</h3>
          <ItemList isForSale={true} isSold={false} />
        </div>

        {/* 삽니다 */}
        <div className="w-[50%]">
          <h3 className="md:text-lg font-bold mb-2 text-base">구매해요</h3>
          <ItemList isForSale={false} isSold={false} />
        </div>
      </div>
    </section>
  );
}
