import { supabase } from "@/shared/api/supabase-client";

export async function getLatestPatchNoteDate() {
  const { data, error } = await supabase
    .from("patch_note")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("패치노트 최신 게시일 조회 실패:", error);
    return null;
  }

  return data?.created_at || null;
}
