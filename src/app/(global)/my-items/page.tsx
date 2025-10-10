import ItemCardWidget from "@/widgets/item-list/ui/ItemCardWidget";
import { createClient } from "@/shared/api/supabase-server-cookie";

export default async function MyItemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="max-w-5xl mx-auto">
        <h2 className="font-bold text-3xl mb-2">내 아이템</h2>
        <p className="text-gray-500 text-sm">
          로그인 후 내 아이템을 확인할 수 있습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h2 className="font-bold text-3xl mb-2">내 아이템</h2>
        <p className="text-gray-500 text-sm">
          판매중인 아이템을 조회/수정할 수 있습니다.
        </p>
        <p className="text-gray-500 text-sm">
          * 보다 정확한 시세 반영을 위해, 판매된 아이템은{" "}
          <b>&apos;수정하기&apos;</b>에서 <b>&apos;판매완료&apos;</b> 상태로
          변경해주세요.
        </p>
      </div>

      <ItemCardWidget userId={user.id} />
    </section>
  );
}
