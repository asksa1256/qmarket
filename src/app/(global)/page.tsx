import { fetchInitialItems } from "@/entities/item/model/server-fetch";
import TabView from "@/widgets/tab-view/ui/TabView";

export default async function Home() {
  const initialItems = await fetchInitialItems(10, 0);

  return (
    <main className="flex min-h-screen">
      <section className="flex flex-1 justify-center p-6">
        <div className="w-6xl">
          <TabView initialItems={initialItems} />
        </div>
      </section>
    </main>
  );
}
