import UploadModal from "@/features/best-dresser/ui/UploadModal";
import Footer from "@/shared/ui/Footer";
import { getUserServer } from "@/shared/api/get-supabase-user-server";
import EntryList from "@/features/best-dresser/ui/EntryList";

export default async function BestDresserPage() {
  const user = await getUserServer();

  return (
    <main className="md:mt-[-70px] md:pt-[200px] min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            👗{" "}
            <span className="bg-[linear-gradient(to_right,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7)] bg-clip-text text-transparent">
              2025 큐플레이 베스트 드레서
            </span>
            🩳
          </h1>
          <p className="text-lg mb-4">
            2025년 연말 결산! 올해 큐플레이를 빛내준 베스트 드레서를
            선택해주세요!
          </p>
          <ul className="text-lg mb-4">
            <li>참여 및 투표 기간: 2025.12.24 ~ 2025.12.30</li>
            <li>결과 발표: 2025.12.31</li>
          </ul>
          <p className="text-sm text-foreground">
            * 계정당 3회까지 참가자로 등록 가능합니다.
          </p>
          <p className="text-sm text-foreground">
            * 1, 2, 3등은 메인 페이지에 게재됩니다.
          </p>
        </header>

        {/* 참여하기 */}
        <div className="flex justify-center mb-40">
          <UploadModal />
        </div>

        {/* 컨테스트 참가자 목록 */}
        <EntryList user={user} />

        <div className="border rounded-xl border-border p-6 text-sm mt-40">
          <p className="text-sm text-foreground/60">
            * 중복 참가 이미지, 아바타 코디와 관련 없는 이미지는 별도의 공지
            없이 삭제됩니다.
          </p>
        </div>
      </div>

      <Footer className="md:pt-12" />
    </main>
  );
}
