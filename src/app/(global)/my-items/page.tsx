import ItemCardList from "@/widgets/item-list/ui/ItemCardList";
import { createClient } from "@/shared/api/supabase-server-cookie";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";
import { Suspense } from "react";

export default async function MyItemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="max-w-5xl mx-auto">
      <h2 className="font-bold text-3xl mb-2 text-center">내 정보</h2>
      {/* {!user ? <LoginRequiredMessage /> : <MyItemsContent userId={user.id} />} */}
      <MyItemsContent userId="76507b38-6db4-4ddf-bae3-eb9f4a4f82c0" />
    </section>
  );
}

const LoginRequiredMessage = () => (
  <>
    <p className="text-gray-500 text-sm mb-4">
      로그인 후 내 아이템을 확인할 수 있습니다.
    </p>
    <ButtonToMain />
  </>
);

const LoadingFallback = <div>아이템 목록을 로드하고 있습니다...</div>;

const ItemSectionHeader = () => (
  <div className="mb-10 text-center">
    <p className="text-gray-500 text-sm">
      판매/구매중인 아이템을 조회/수정할 수 있습니다.
    </p>
  </div>
);

const MyItemsContent = ({ userId }: { userId: string }) => (
  <div className="p-4 md:p-0">
    <ItemSectionHeader />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* 팝니다 */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">팝니다</h3>
        <Suspense fallback={LoadingFallback}>
          <ItemCardList userId={userId} isForSale={true} isSold={false} />
        </Suspense>
      </div>

      {/* 삽니다 */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">삽니다</h3>
        <Suspense fallback={LoadingFallback}>
          <ItemCardList userId={userId} isForSale={false} isSold={false} />
        </Suspense>
      </div>

      {/* 판매 완료 */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">판매 완료</h3>
        <Suspense fallback={LoadingFallback}>
          <ItemCardList userId={userId} isForSale={true} isSold={true} />
        </Suspense>
      </div>

      {/* 구매 완료 */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">구매 완료</h3>
        <Suspense fallback={LoadingFallback}>
          <ItemCardList userId={userId} isForSale={false} isSold={true} />
        </Suspense>
      </div>
    </div>
  </div>
);
