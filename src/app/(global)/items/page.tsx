import { redirect } from "next/navigation";
import ItemList from "@/features/items/ui/ItemList";
import SectionTitle from "@/shared/ui/SectionTitle";
import SellingItemCreateModal from "@/features/item/ui/SellingItemCreateModal";
import PurchaseItemCreateModal from "@/features/item/ui/PurchaseItemCreateModal";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";
import { getUserServer } from "@/shared/api/get-supabase-user-server";
import DirectPriceCreateModal from "@/features/market/ui/DirectPriceCreateModal";

export default async function ItemsPage() {
  const user = await getUserServer();

  if (!user) {
    redirect("/");
  }

  return (
    <section className="w-full lg:max-w-6xl mx-auto">
      <ButtonToMain />
      <SectionTitle>🧾 거래 전체 현황</SectionTitle>

      <div className="flex gap-4 md:flex-row flex-col">
        <div className="shrink-0 md:min-w-[264px]">
          <div className="sticky top-20">
            <SectionTitle className="!text-lg">📝 아이템 등록</SectionTitle>
            {/* 구매/판매 아이템 등록 버튼 */}
            <div className="flex flex-col gap-2">
              <SellingItemCreateModal />
              <PurchaseItemCreateModal />
            </div>
          </div>
        </div>

        <div className="grid grow gap-4 md:grid-cols-2 grid-cols-1">
          <div className="flex flex-col gap-2">
            <h3 className="md:text-lg font-bold mb-2 text-base">판매해요</h3>
            <ItemList isForSale={true} isSold={false} />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="md:text-lg font-bold mb-2 text-base">구매해요</h3>
            <ItemList isForSale={false} isSold={false} />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="md:text-lg font-bold mb-2 text-base">판매완료</h3>
            <ItemList isForSale={true} isSold={true} />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="md:text-lg font-bold mb-2 text-base">구매완료</h3>
            <ItemList isForSale={false} isSold={true} />
          </div>
        </div>
      </div>
    </section>
  );
}
