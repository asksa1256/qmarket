import { supabase } from "@/shared/api/supabase-client";
import { BestDresserEntry } from "../model/bestDresserType";
import { Button } from "@/shared/ui/button";

interface EntryCardProps {
  data: BestDresserEntry;
  onVoteSuccess: () => void;
}

export default function EntryCard({ data, onVoteSuccess }: EntryCardProps) {
  const handleVote = async () => {
    // 단순화된 투표 로직 (RPC 또는 직접 update)
    const { error } = await supabase
      .from("best_dresser")
      .update({ votes: data.votes + 1 })
      .eq("id", data.id);

    if (!error) onVoteSuccess();
  };

  return (
    <div className="bg-white/70 p-2 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-105 border border-white/50">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={data.image_url}
          alt="Avatar"
          className="object-contain w-full h-full"
        />
      </div>
      <div className="my-4 flex flex-col gap-2 items-center">
        <p className="text-center text-sm p-4 bg-gray-100 rounded-xl">
          {data.description}
        </p>
        <div className="flex items-center justify-between w-full">
          <span className="text-xs">
            참가자:{" "}
            <span className="font-bold text-gray-800">{data.nickname}</span>
          </span>
          <p className="text-sm text-pink-500 font-semibold">
            💖 {data.votes}표
          </p>
        </div>

        <Button
          type="button"
          onClick={handleVote}
          className="mt-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-full font-bold hover:shadow-lg transition-all active:scale-95"
        >
          투표하기
        </Button>
      </div>
    </div>
  );
}
