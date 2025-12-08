import { getSupabaseServerCookie } from "@/shared/api/supabase-cookie";
import { supabaseServer } from "@/shared/api/supabase-server";
import UserDetailSection from "@/features/user/ui/UserDetailSection";

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
    return <div>회원 정보를 찾을 수 없습니다.</div>;
  }

  return <UserDetailSection user={userDetail} />;
}
