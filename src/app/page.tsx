import { fetchInitialItems } from "./entities/item/model/server-fetch";
import ClientMoreItems from "./widgets/item-list/ui/ClientMoreItems";
import ItemListHeaderWidget from "./widgets/item-list-header/ui/ItemListHeaderWidget";

export default async function Home() {
  const initialItems = await fetchInitialItems(10, 0);

  return (
    <main className="flex min-h-screen">
      <section className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Q-Market</h1>
        <ItemListHeaderWidget />

        <div className="max-w-3xl mx-auto">
          <ClientMoreItems initialItems={initialItems} />
        </div>
      </section>
    </main>
  );
}
