// app/page.tsx
import { fetchInitialItems } from "@/entities/item/model/server-fetch";
import TabView from "@/widgets/tab-view/ui/TabView";

export default async function Home() {
  const initialItems = await fetchInitialItems(10, 0);

  return (
    <main className="flex min-h-screen">
      <section className="flex flex-1 justify-center p-6">
        <div className="w-6xl">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold mb-2">Q-Market</h1>
            <p className="text-gray-500 text-sm">
              큐플레이 아이템 판매 현황, 시세 조회
            </p>
          </div>

          <TabView initialItems={initialItems} />
        </div>
      </section>
    </main>
  );
}
