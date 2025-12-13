import { getSupabaseServerCookie } from "@/shared/api/supabase-cookie";
import { supabaseServer } from "@/shared/api/supabase-server";
import UserDetailSection from "@/features/user/ui/UserDetailSection";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";

export default async function MyItemsPage() {
  const supabase = await getSupabaseServerCookie();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userDetail, error } = await supabaseServer
    .from("user_profiles")
    .select("id, username, bio, discord_profile_image, nickname, created_at")
    .eq("id", user?.id)
    .single();

  if (error || !user) {
    return (
      <div className="flex items-center justify-center lg:max-w-6xl mx-auto lg:px-0 px-4">
        로그인이 필요합니다.
      </div>
    );
  }

  return (
    <div className="lg:max-w-6xl mx-auto lg:px-0 px-4">
      <h1 className="mb-20 text-3xl font-bold text-center">마이페이지</h1>
      <ButtonToBack />
      <UserDetailSection user={userDetail} isMyPage={true} />
    </div>
  );
}
