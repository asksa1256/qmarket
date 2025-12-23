import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import { BestDresserEntry } from "../model/bestDresserType";
import { Button } from "@/shared/ui/button";
import { InfiniteData } from "@tanstack/react-query";

interface EntryCardProps {
  data: BestDresserEntry;
}

export default function EntryCard({ data }: EntryCardProps) {
  const queryClient = useQueryClient();

  const { mutate: voteMutation } = useMutation({
    mutationFn: async (newVotes: number) => {
      const { error } = await supabase
        .from("best_dresser")
        .update({ votes: newVotes })
        .eq("id", data.id);

      if (error) throw error;
    },

    onMutate: async (newVotes) => {
      await queryClient.cancelQueries({ queryKey: ["best_dresser"] });

      const previousEntries = queryClient.getQueryData(["best_dresser"]);

      // useInfiniteQuery 리턴 데이터에 맞춰 구조 설정
      queryClient.setQueryData<InfiniteData<BestDresserEntry[]>>(
        ["best_dresser"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((entry) =>
                entry.id === data.id ? { ...entry, votes: newVotes } : entry
              )
            ),
          };
        }
      );

      // 실패 시 onError에서 처리하기 위해 이전 데이터 반환
      return { previousEntries };
    },

    onError: (_err, _newVotes, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(["best_dresser"], context.previousEntries);
      }
      alert("투표 처리 중 오류가 발생했습니다.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["best_dresser"] });
    },
  });

  const handleVote = () => {
    voteMutation((data.votes || 0) + 1);
  };

  return (
    <div className="bg-white/70 p-3 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-[1.03] border border-white/50">
      {/* 이미지 */}
      <div className="relative w-[184px] h-[236px] mx-auto">
        <img
          src={data.image_url}
          alt="Avatar"
          className="object-contain w-full h-full rounded-xl overflow-hidden"
        />
      </div>

      {/* 내용 */}
      <div className="mt-4 flex flex-col gap-3">
        <p className="h-[62px] overflow-y-auto text-sm text-gray-700 leading-relaxed px-3 py-2 bg-gray-100/80 rounded-lg text-center">
          {data.description || "등록된 설명이 없습니다."}
        </p>

        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-500">
            닉네임:
            <span className="ml-0.5 font-medium text-gray-800">
              {data.nickname}
            </span>
          </span>

          <span className="text-sm font-semibold text-pink-500 flex items-center gap-1">
            💖 {data.votes}
          </span>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={handleVote}
          className="mt-2 w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-2 font-semibold hover:shadow-md transition-all active:scale-95"
        >
          투표하기
        </Button>
      </div>
    </div>
  );
}
