import { fetchInitialItems } from "./entities/item/model/server-fetch";
import ClientMoreItems from "./widgets/item-list/ui/ClientMoreItems";

export default async function Home() {
  const initialItems = await fetchInitialItems(10, 0);

  return (
    <main className="flex min-h-screen">
      <section className="flex-1 p-6">
        <div className="mb-12">
          <h1 className="text-3xl text-center font-bold mb-2">Q-Market</h1>
          <p className="text-center text-gray-500 text-sm">
            큐플레이 아이템 판매 현황, 시세 조회 서비스
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ClientMoreItems initialItems={initialItems} />
        </div>
      </section>
    </main>
  );
}
