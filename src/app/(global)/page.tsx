import ItemCategoryNav from "@/features/items/ui/ItemCategoryNav";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
    <main className="flex p-4 md:p-0 mt-20">
      <section className="flex flex-col w-full gap-4 items-center">
        {/* 아이템 카테고리 메뉴 */}
        <div className="w-full max-w-4xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              아이템 카테고리 검색
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              찾으시는 아이템의 종류를 선택하여 빠르게 검색해보세요.
            </p>
          </div>

          <div className="p-4 md:p-6 rounded-3xl bg-card border shadow-sm flex justify-center items-center">
            <ItemCategoryNav />
          </div>
        </div>

        {/* 이번 달 로테이션 아이템 */}
        <div className="mt-10 w-full max-w-4xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-2xl flex items-center gap-2">
              ✨ 이번 달 로테이션 아이템
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
                <div className="hidden md:flex items-center justify-center size-12 rounded-full bg-blue-100 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ExternalLink className="size-6" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 하단 그리드 메뉴 */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
          <Link href="/rotation-items/last">
            <div className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors h-full">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
                {lastMonthYear}년 {formattedLastMonth}월 로테이션{" "}
                <ExternalLink className="size-4" />
              </h3>
              <p className="text-muted-foreground break-keep">
                지난 달의 로테이션 아이템들을 확인해보세요.
              </p>
            </div>
          </Link>

          <Link href="/my-items">
            <div className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
                구매/판매 아이템 등록 <ExternalLink className="size-4" />
              </h3>
              <p className="text-muted-foreground break-keep">
                구매하거나 판매하고 싶은 아이템을 등록할 수 있습니다.
              </p>
            </div>
          </Link>

          <div className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors">
            <h3 className="text-lg font-semibold mb-2">아이템 정보 조회</h3>
            <p className="text-muted-foreground break-keep">
              아이템 판매/구매 현황, 출처, 시세 등 다양한 정보를 확인할 수
              있습니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
