import ItemCategoryNav from "@/features/items/ui/ItemCategoryNav";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import SearchBar from "@/features/item-search/ui/SearchBar";

export default async function Home() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // 지난 달 계산 (연도 넘어가는 경우 포함)
  const lastMonthDate = new Date(now);
  lastMonthDate.setMonth(now.getMonth() - 1);
  const lastMonthYear = lastMonthDate.getFullYear();
  const lastMonth = lastMonthDate.getMonth() + 1;

  const formattedMonth = String(month).padStart(2, "0");
  const formattedLastMonth = String(lastMonth).padStart(2, "0");

  return (
    <main className="flex mt-8">
      <section className="flex flex-col w-full gap-8 items-center">
        {/* 아이템 검색 */}
        <div className="mb-12 flex flex-col gap-2 items-center md:w-xl w-full max-w-md">
          <div className="mb-4 text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Q-Market
            </h2>
            <p className="text-foreground/50 text-sm max-w-[70%] mx-auto md:max-w-none md:mx-0">
              큐플레이 아이템 구매/판매 등록 및 조회, 아이템 상세 정보, 시세
              조회
            </p>
          </div>

          <SearchBar className="w-full [&_input]:!max-w-none [&_input]:rounded-full md:[&_input]:!text-lg [&_input]:h-auto md:[&_input]:!px-6 md:[&_input]:!py-4" />
        </div>

        {/* 이번 달 로테이션 */}
        <div className="mb-12 w-full max-w-4xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-2xl flex items-center gap-2">
              ✨ 이번 달 로테이션
            </h3>
          </div>

          <Link href="/rotation-items/new" className="group block">
            {/* 좌측 상단 배경 그라데이션 */}
            <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-blue-200 via-card to-card border border-blue-300 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-primary/15 hover:-translate-y-1">
              {/* 우측 상단 배경 그라데이션 */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-primary bg-blue-300 rounded-full border border-primary/20">
                    NEW UPDATE
                  </span>

                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {year}년 {formattedMonth}월 로테이션{" "}
                    <ExternalLink className="inline-block size-5 md:hidden" />
                  </h3>

                  <p className="text-muted-foreground break-keep max-w-xl">
                    이번 달에 업데이트된 새로운 뽑기, 요술상자 아이템을
                    확인해보세요!
                  </p>
                </div>

                {/* 오른쪽 화살표 아이콘 (CTA 강조) */}
                <div className="hidden md:flex items-center justify-center size-12 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ExternalLink className="size-6" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 아이템 카테고리 메뉴 */}
        <div className="w-full max-w-4xl">
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              🧭 아이템 카테고리별 조회
            </h2>
          </div>

          <div className="p-4 md:p-6 rounded-3xl bg-card border shadow-sm flex justify-center items-center">
            <ItemCategoryNav />
          </div>
        </div>

        {/* 하단 그리드 메뉴 */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
          <Link href="/rotation-items/last" className="h-full">
            <div className="h-full p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors break-keep">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
                {lastMonthYear}년 {formattedLastMonth}월 로테이션{" "}
                <ExternalLink className="size-4" />
              </h3>
              <p className="text-muted-foreground">
                지난 달 로테이션 아이템 리스트입니다.
              </p>
            </div>
          </Link>

          <Link href="/my-items" className="h-full">
            <div className="h-full p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors break-keep">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
                구매/판매 아이템 등록 <ExternalLink className="size-4" />
              </h3>
              <p className="text-muted-foreground">
                구매하거나 판매하고 싶은 아이템을 등록할 수 있습니다.
              </p>
            </div>
          </Link>

          <div className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors h-full break-keep">
            <h3 className="text-lg font-semibold mb-2">아이템 정보 조회</h3>
            <p className="text-muted-foreground">
              아이템 판매/구매 현황, 출처, 시세 등 다양한 정보를 확인해보세요.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
