import ItemPriceChangesTable from "@/features/market/ui/itemPriceChanges/ItemPriceChangesTable";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";
import { redirect } from "next/navigation";
import { getUserServer } from "@/shared/api/get-supabase-user-server";
import ItemPriceChangesContainer from "@/features/market/ui/itemPriceChanges/ItemPriceChangesContainer";

export default async function ItemPriceChangesPage() {
  const user = await getUserServer();

  if (!user) {
    redirect("/");
  }

  return (
    <section className="w-full max-w-4xl mx-auto space-y-16">
      <ButtonToBack />

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          📊 주간 시세 변동 내역
        </h2>

        <ul className="border rounded-lg p-4 text-sm text-foreground/70 mb-8 list-disc list-inside">
          <li>변동률은 최근 거래일 기준 n일 전 대비 변동률입니다.</li>
        </ul>

        {/* 시세 변동 내역 */}
        <ItemPriceChangesContainer />
      </section>
    </section>
  );
}
