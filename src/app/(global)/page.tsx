import ItemCategoryNav from "@/features/items/ui/ItemCategoryNav";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import SearchBar from "@/features/item-search/ui/SearchBar";
import ItemList from "@/features/items/ui/ItemList";
import RollingPopularSearch from "@/features/item-search/ui/RollingPopularSearch";
import { getPopularSearchesAction } from "../actions/search-actions";
import GoToItemsModal from "@/features/items/ui/GoToItemsModal";
import SignInToast from "@/features/auth/signin/ui/SignInToast";
import GoToMyItemsModal from "@/features/user/ui/GoToMyItemsModal";

export default async function Home({
  params,
}: {
  params: Promise<{ auth_reason?: string }>;
}) {
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

  // 인기 검색어 로드
  const data = await getPopularSearchesAction();

  // 리디렉션 토스트 띄우기용 파라미터
  const { auth_reason } = await params;

  return (
    <main className="flex">
      <div className="flex flex-col w-full gap-8 items-center">
        {/* 아이템 검색 */}
        <section className="mb-12 flex flex-col gap-2 items-center md:w-xl w-full max-w-md">
          <div className="mb-4 text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              큐플레이 아이템 거래 현황 · 시세 조회
            </h2>
            <p className="text-foreground/50 text-sm max-w-[70%] mx-auto md:max-w-none md:mx-0 break-keep">
              최근 거래 · 시세 확인 · 아이템 정보
            </p>
          </div>

          <SearchBar className="w-full [&_input]:!max-w-none [&_input]:rounded-full md:[&_input]:!text-lg [&_input]:h-auto md:[&_input]:!px-6 md:[&_input]:!py-4" />

          {/* 인기 검색어 TOP 5 */}
          <RollingPopularSearch data={data} />
        </section>

        {/* 이벤트 섹션 */}
        <section className="mb-12 w-full max-w-4xl">
          <h3 className="font-bold text-2xl flex items-center gap-2 mb-4">
            🎉 이벤트 🎉
          </h3>

          <Link href="/best-dresser" className="group block">
            {/* 좌측 상단 배경 그라데이션 */}
            <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-pink-400 via-yellow-300 to-blue-400 border border-purple-300 transition-all duration-300 shadow-lg hover:shadow-primary/15 hover:-translate-y-1">
              {/* 우측 상단 배경 그라데이션 */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-primary bg-pink-500 rounded-full border border-primary/20">
                    EVENT
                  </span>

                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {year}년 큐플레이 베스트 드레서 컨테스트
                    <ExternalLink className="inline-block size-5 md:hidden" />
                  </h3>

                  <p className="text-foreground break-keep max-w-xl">
                    올해 큐플레이를 빛내준 베스트 드레서를 투표해보세요!
                    <br />
                    <span className="text-xs">(2025.12.24 ~ 2025.12.30)</span>
                  </p>
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center justify-center size-12 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ExternalLink className="size-6" />
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* 최근 판매/구매 현황 */}
        <section className="w-full max-w-4xl mb-12">
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              ⭐ 거래 현황
            </h2>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {/* 판매해요 */}
            <div className="flex flex-col gap-2">
              <h3 className="md:text-lg font-bold text-base">판매해요</h3>
              <ItemList
                isForSale={true}
                isSold={false}
                limit={3}
                className="pb-0 [&>div]:h-[260px]"
              />
            </div>

            {/* 구매해요 */}
            <div className="flex flex-col gap-2">
              <h3 className="md:text-lg font-bold text-base">구매해요</h3>
              <ItemList
                isForSale={false}
                isSold={false}
                limit={3}
                className="pb-0 [&>div]:h-[260px]"
              />
            </div>

            {/* 판매완료 */}
            <div className="flex flex-col gap-2 mt-4">
              <h3 className="md:text-lg font-bold text-base">판매완료</h3>
              <ItemList
                isForSale={true}
                isSold={true}
                limit={2}
                className="pb-0 [&>div]:h-[176px]"
              />
            </div>

            {/* 구매완료 */}
            <div className="flex flex-col gap-2 mt-4">
              <h3 className="md:text-lg font-bold text-base">구매완료</h3>
              <ItemList
                isForSale={false}
                isSold={true}
                limit={2}
                className="pb-0 [&>div]:h-[176px]"
              />
            </div>
          </div>

          {/* 전체 거래 현황 보기 CTA */}
          <GoToItemsModal />
        </section>

        {/* 이번 달 로테이션 */}
        <section className="mb-12 w-full max-w-4xl">
          <h3 className="font-bold text-2xl flex items-center gap-2 mb-4">
            ✨ 이번 달 로테이션
          </h3>

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

                {/* CTA */}
                <div className="hidden md:flex items-center justify-center size-12 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ExternalLink className="size-6" />
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* 아이템 카테고리 메뉴 */}
        <section className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            🧭 아이템 카테고리별 조회
          </h2>

          <div className="p-4 md:p-6 rounded-3xl bg-card border shadow-sm flex justify-center items-center">
            <ItemCategoryNav />
          </div>
        </section>

        {/* 하단 그리드 메뉴 */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
          <GoToMyItemsModal />

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
        </section>

        {/* 안내 섹션 */}
        <section className="px-8 py-4 bg-muted-foreground/5 rounded-2xl text-foreground/50">
          <p className="text-center text-sm break-keep">
            큐마켓은 가격을 결정하지 않으며, 가격 판단을 돕는 참고 정보를
            제공합니다.
          </p>
        </section>
      </div>

      {/* auth guard: 권한 필요 페이지에서 메인으로 리디렉션 시 표시될 토스트 */}
      {auth_reason === "login_required" && <SignInToast />}
    </main>
  );
}
