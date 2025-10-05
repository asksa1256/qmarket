import ItemCardWidget from "@/widgets/item-list/ui/ItemCardWidget";
import { createClient } from "@/shared/api/supabase-server-cookie";

export default async function MyItemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="font-bold text-3xl mb-2">내 아이템</h2>
        <p className="text-gray-500 text-sm">
          판매중인 아이템을 조회/수정할 수 있습니다.
        </p>
      </div>

      <ItemCardWidget userId={user?.id!} />
    </section>
  );
}
