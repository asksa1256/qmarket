import SearchBar from "@/features/item-search/ui/SearchBar";

export default async function Home() {
  return (
    <main className="flex min-h-screen p-4 md:p-0">
      <section className="flex flex-col w-full gap-4 items-center">
        <div className="text-center my-4">
          <h2 className="font-bold text-3xl mb-2">Q-Market</h2>
          <p className="text-gray-500 text-sm">
            큐플레이 아이템 시세/판매 현황 조회, 판매 아이템 등록
          </p>
        </div>

        {/* 검색바 */}
        <div className="w-full">
          <SearchBar />
        </div>

        {/* <div className="w-full md:w-6xl">
          <TabView initialItems={initialItems} />
        </div> */}
      </section>
    </main>
  );
}
