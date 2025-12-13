import { supabaseServer } from "@/shared/api/supabase-server";
import UserDetailSection from "@/features/user/ui/UserDetailSection";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const { data: user, error } = await supabaseServer
    .from("user_profiles")
    .select("id, username, bio, discord_profile_image, nickname, created_at")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return (
      <div className="lg:max-w-6xl mx-auto lg:px-0 px-4 text-center">
        존재하지 않는 유저입니다.
      </div>
    );
  }

  return (
    <div className="lg:max-w-6xl mx-auto lg:px-0 px-4">
      <ButtonToBack />
      <UserDetailSection user={user} isMyPage={false} />
    </div>
  );
}
