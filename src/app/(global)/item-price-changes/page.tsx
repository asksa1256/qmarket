import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";
import { getUserServer } from "@/shared/api/get-supabase-user-server";
import ItemPriceChangesContainer from "@/features/market/ui/itemPriceChanges/ItemPriceChangesContainer";

export default async function ItemPriceChangesPage() {
  const user = await getUserServer();

  if (!user) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 min-h-[20vh]">
          <p>로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-16">
      <ButtonToBack />

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          📊 주간 시세 변동 내역
        </h2>

        <ul className="border rounded-lg p-4 text-sm text-foreground/70 mb-8 list-disc list-inside leading-6">
          <li>변동률은 최근 거래일 기준 n일 전 대비 변동률입니다.</li>
          <li>
            <span className="text-foreground/50">(신규)</span> 아이템은 시세가
            당일에 신규 등록된 아이템입니다.
          </li>
          <li>시세는 단일 거래 가격이 아닌 당일 거래 평균가로 산출됩니다.</li>
        </ul>

        {/* 시세 변동 내역 */}
        <ItemPriceChangesContainer />

        <div className="my-12 px-8 py-4 bg-muted-foreground/5 rounded-2xl text-foreground/50">
          <p className="text-center text-sm break-keep">
            큐마켓은 가격을 결정하지 않으며, 거래에 필요한 참고 정보를
            제공합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
