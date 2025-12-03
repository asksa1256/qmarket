import ItemCategoryNav from "@/features/items/ui/ItemCategoryNav";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function Home() {
  return (
    <main className="flex p-4 md:p-0">
      <section className="flex flex-col w-full gap-4 items-center">
        <div className="text-center my-4">
          <h2 className="font-bold text-3xl mb-2">Q-Market</h2>
          <p className="text-gray-500 text-sm">
            큐플레이 아이템 시세/판매 현황 조회, 판매 아이템 등록
          </p>
        </div>

        {/* 아이템 카테고리 메뉴 */}
        <div className="mt-4">
          <h3 className="font-bold text-xl text-center mb-4">
            아이템 카테고리별 검색
          </h3>
          <ItemCategoryNav />
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
          <Link href="/items">
            <div className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors h-full">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
                실시간 판매/구매 목록 확인 <ExternalLink className="size-4" />
              </h3>
              <p className="text-muted-foreground break-keep">
                아이템의 실시간 구매/판매 현황을 확인할 수 있습니다.
              </p>
            </div>
          </Link>

          <Link href="/my-items">
            <div className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
                간편한 아이템 등록 <ExternalLink className="size-4" />
              </h3>
              <p className="text-muted-foreground break-keep">
                구매하거나 판매하고 싶은 아이템을 등록할 수 있습니다.
              </p>
            </div>
          </Link>

          <div className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors">
            <h3 className="text-lg font-semibold mb-2">아이템 시세 조회</h3>
            <p className="text-muted-foreground break-keep">
              거래 내역을 바탕으로 아이템 시세를 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
