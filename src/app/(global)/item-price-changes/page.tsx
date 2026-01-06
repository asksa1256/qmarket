import ItemPriceChangesTable from "@/features/market/ui/ItemPriceChangesTable";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";

export default async function ItemPriceChangesPage() {
  return (
    <section className="w-full max-w-4xl mx-auto space-y-16">
      <ButtonToBack />

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          📊 주간 시세 변동 내역
        </h2>
        <ItemPriceChangesTable />
      </section>
    </section>
  );
}
