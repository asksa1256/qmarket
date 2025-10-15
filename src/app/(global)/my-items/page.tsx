import ItemCardList from "@/widgets/item-list/ui/ItemCardList";
import { createClient } from "@/shared/api/supabase-server-cookie";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";

export default async function MyItemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="max-w-5xl mx-auto">
      {!user ? <LoginRequiredMessage /> : <MyItemsContent userId={user.id} />}
    </section>
  );
}

const LoginRequiredMessage = () => (
  <>
    <h2 className="font-bold text-3xl mb-2">내 아이템</h2>
    <p className="text-gray-500 text-sm mb-4">
      로그인 후 내 아이템을 확인할 수 있습니다.
    </p>
    <ButtonToMain />
  </>
);

const ItemSectionHeader = () => (
  <div className="mb-10 text-center">
    <h2 className="font-bold text-3xl mb-2">내 아이템</h2>
    <p className="text-gray-500 text-sm">
      판매중인 아이템을 조회/수정할 수 있습니다.
    </p>
  </div>
);

const MyItemsContent = ({ userId }: { userId: string }) => (
  <div className="p-4 md:p-0">
    <ItemSectionHeader />
    <ItemCardList userId={userId} />
  </div>
);
