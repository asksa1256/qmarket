import { Suspense } from "react";
import UserItemList from "@/features/items/ui/UserItemList";
import UserProfileCard from "./UserProfileCard";
import { UserDetail } from "../model/userTypes";
import UserItemListHeader from "@/features/items/ui/UserItemListHeader";

interface UserDetailProps {
  user: UserDetail;
}

const LoadingFallback = <div>로드중...</div>;

export default function UserDetailSection({ user }: UserDetailProps) {
  const BuySellListSection = () => (
    <div className="pl-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
        🛒 판매 / 구매 목록
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* 팝니다 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">팝니다</h3>
          <Suspense fallback={LoadingFallback}>
            <UserItemList userId={user.id} isForSale={true} isSold={false} />
          </Suspense>
        </div>

        {/* 삽니다 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">삽니다</h3>
          <Suspense fallback={LoadingFallback}>
            <UserItemList userId={user.id} isForSale={false} isSold={false} />
          </Suspense>
        </div>

        {/* 판매 완료 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">판매 완료</h3>
          <Suspense fallback={LoadingFallback}>
            <UserItemList userId={user.id} isForSale={true} isSold={true} />
          </Suspense>
        </div>

        {/* 구매 완료 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">구매 완료</h3>
          <Suspense fallback={LoadingFallback}>
            <UserItemList userId={user.id} isForSale={false} isSold={true} />
          </Suspense>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex lg:max-w-6xl mx-auto">
      {/* 좌측 사이드바 (유저 정보) */}
      <aside className="w-64 shrink-0">
        <UserProfileCard user={user} />
      </aside>

      {/* 우측 컨텐츠 (삽니다/팝니다 목록) */}
      <section className="grow">
        <UserItemListHeader userId={user.id} />
        <BuySellListSection />
      </section>
    </div>
  );
}
