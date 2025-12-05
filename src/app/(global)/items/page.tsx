import ItemList from "@/features/items/ui/ItemList";
import SectionTitle from "@/shared/ui/SectionTitle";
import ItemsClient from "@/features/items/ui/ItemsClient";

export default function ItemsPage() {
  return (
    <section className="w-full lg:max-w-6xl mx-auto">
      <SectionTitle>📋 판매/구매 전체</SectionTitle>
      <ItemsClient />
    </section>
  );
}
