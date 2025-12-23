import { supabaseServer } from "@/shared/api/supabase-server";
import CommentSection from "@/features/comment/ui/CommentSection";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: entry } = await supabaseServer
    .from("best_dresser")
    .select("*")
    .eq("id", id)
    .single();

  if (!entry) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 mt-20">
      <ButtonToBack className="hover:bg-pink-100" />

      <div className="mb-8 flex flex-col justify-center items-center">
        <img
          src={entry.image_url}
          alt={entry.nickname}
          className="w-[320px] rounded-2xl mb-8"
        />
        <h2 className="text-2xl font-bold mb-2">
          {entry.description}{" "}
          <span className="inline-flex items-center gap-2 text-pink-500 font-bold">
            💖 {entry.votes}
          </span>
        </h2>
        <p className="text-gray-600 mb-4">{entry.nickname}</p>
      </div>

      <CommentSection entryId={entry.id} />
    </div>
  );
}
