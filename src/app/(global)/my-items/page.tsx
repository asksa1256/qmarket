import ItemCardWidget from "@/widgets/item-list/ui/ItemCardWidget";
import { createClient } from "@/shared/api/supabase-server-cookie";
import ItemUploadModal from "@/features/item-upload-modal/ui/ItemUploadModal";

export default async function MyItemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="max-w-4xl mx-auto">
        <h2 className="font-bold text-3xl mb-2">내 아이템</h2>
        <p className="text-gray-500 text-sm">
          로그인 후 내 아이템을 확인할 수 있습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="font-bold text-3xl mb-2">내 아이템</h2>
        <p className="text-gray-500 text-sm">
          판매중인 아이템을 조회/수정할 수 있습니다.
        </p>
        <p className="text-gray-500 text-sm">
          * '판매 완료' 처리는 '수정하기'를 이용해주세요.
        </p>
        <p className="text-gray-500 text-sm">
          * '판매 완료' 처리된 아이템의 가격은 '거래 시세'에 반영됩니다.
        </p>
      </div>

      <div className="flex w-full mb-8 justify-end">
        <ItemUploadModal />
      </div>

      <ItemCardWidget userId={user.id} />
    </section>
  );
}
