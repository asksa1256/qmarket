import { Suspense } from "react";
import UserItemList from "@/features/user/ui/UserItemList";
import UserProfileCard from "./UserProfileCard";
import { UserDetail } from "../model/userTypes";
import SectionTitle from "@/shared/ui/SectionTitle";
import MyItemRequestSection from "./MyItemRequestSection";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import UserItemListHeader from "./UserItemListHeader";

interface UserDetailProps {
  user: UserDetail;
  isMyPage?: boolean;
}

export default async function UserDetailSection({
  user,
  isMyPage,
}: UserDetailProps) {
  const BuySellListSection = () => (
    <div className="md:pl-8">
      <SectionTitle>📋 판매 / 구매 목록</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* 팝니다 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">판매해요</h3>
          <Suspense fallback={<LoadingSpinner />}>
            <UserItemList userId={user.id} isForSale={true} isSold={false} />
          </Suspense>
        </div>

        {/* 삽니다 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">구매해요</h3>
          <Suspense fallback={<LoadingSpinner />}>
            <UserItemList userId={user.id} isForSale={false} isSold={false} />
          </Suspense>
        </div>

        {/* 판매 완료 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">판매 완료</h3>
          <Suspense fallback={<LoadingSpinner />}>
            <UserItemList userId={user.id} isForSale={true} isSold={true} />
          </Suspense>
        </div>

        {/* 구매 완료 */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">구매 완료</h3>
          <Suspense fallback={<LoadingSpinner />}>
            <UserItemList userId={user.id} isForSale={false} isSold={true} />
          </Suspense>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex md:flex-row flex-col">
      {/* 좌측 사이드바 (유저 정보) */}
      <aside className="w-full md:w-65 max-w-65 mx-auto shrink-0">
        <div className="md:sticky top-24">
          <UserProfileCard user={user} />
        </div>
      </aside>

      {/* 우측 컨텐츠 (삽니다/팝니다 목록) */}
      <section className="grow md:mt-0 mt-8">
        {/* 구매/판매 등록 버튼 (마이페이지 전용) */}
        {isMyPage && <UserItemListHeader />}

        {/* 전체 공개: 팝니다/삽니다 목록 */}
        <BuySellListSection />

        {/* 아이템 등록 요청 정보 (마이페이지 전용) */}
        {isMyPage && <MyItemRequestSection userId={user.id} />}
      </section>
    </div>
  );
}
