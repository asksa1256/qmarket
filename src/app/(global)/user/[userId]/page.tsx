import { supabaseServer } from "@/shared/api/supabase-server";
import UserDetailSection from "@/features/user/ui/UserDetailSection";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const { data: user, error } = await supabaseServer
    .from("user_profiles")
    .select("id, username, bio, discord_profile_image, created_at")
    .eq("id", userId)
    .single();

  if (error || !user) {
    return <div>존재하지 않는 유저입니다.</div>;
  }

  return (
    <>
      <UserDetailSection user={user} />
    </>
  );
}
