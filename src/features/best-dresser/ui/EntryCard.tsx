"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import { BestDresserEntry } from "../model/bestDresserType";
import { Button } from "@/shared/ui/button";
import { InfiniteData } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Heart } from "lucide-react";

interface EntryCardProps {
  data: BestDresserEntry;
  user: User | null;
}

export default function EntryCard({ data, user }: EntryCardProps) {
  const queryClient = useQueryClient();

  // 중복 투표 방지
  const { data: myVote } = useQuery({
    queryKey: ["my_vote", data.id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data: voteData } = await supabase
        .from("best_dresser_votes")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_id", data.id)
        .maybeSingle();
      return voteData;
    },
    enabled: !!user, // 로그인했을 때만 실행
  });

  const isVoted = !!myVote;

  const { mutate: toggleVoteMutation } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("로그인이 필요합니다.");

      if (isVoted) {
        const { error: deleteError } = await supabase
          .from("best_dresser_votes")
          .delete()
          .eq("user_id", user.id)
          .eq("entry_id", data.id);

        if (deleteError) throw deleteError;

        await supabase
          .from("best_dresser")
          .update({ votes: Math.max(0, (data.votes || 0) - 1) })
          .eq("id", data.id);
      } else {
        const { error: insertError } = await supabase
          .from("best_dresser_votes")
          .insert({ user_id: user.id, entry_id: data.id });

        if (insertError) throw insertError;

        await supabase
          .from("best_dresser")
          .update({ votes: (data.votes || 0) + 1 })
          .eq("id", data.id);
      }
    },

    // 낙관적 업데이트
    onMutate: async (newVotes) => {
      await queryClient.cancelQueries({ queryKey: ["best_dresser"] });
      await queryClient.cancelQueries({
        queryKey: ["my_vote", data.id, user?.id],
      });

      const previousEntries = queryClient.getQueryData(["best_dresser"]);

      // 투표 수 먼저 업데이트
      const nextVotes = isVoted ? Math.max(0, data.votes - 1) : data.votes + 1;

      // useInfiniteQuery 리턴 데이터에 맞춰 구조 설정
      queryClient.setQueryData<InfiniteData<BestDresserEntry[]>>(
        ["best_dresser"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((entry) =>
                entry.id === data.id ? { ...entry, votes: nextVotes } : entry
              )
            ),
          };
        }
      );

      // 투표 상태 먼저 반영
      queryClient.setQueryData(
        ["my_vote", data.id, user?.id],
        isVoted ? null : { id: "temp" }
      );

      // 실패 시 onError에서 처리하기 위해 이전 데이터 반환
      return { previousEntries };
    },

    onError: (_err, _newVotes, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(["best_dresser"], context.previousEntries);
      }
      alert("투표 중 오류가 발생했습니다.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["best_dresser"] });
      queryClient.invalidateQueries({
        queryKey: ["my_vote", data.id, user?.id],
      });
    },
  });

  const handleVote = () => {
    if (!user) {
      toast.error("로그인 후 투표할 수 있습니다!");
      return;
    }
    toggleVoteMutation();

    // if (!isVoted) {
    //   confetti({
    //     particleCount: 40,
    //     spread: 70,
    //     origin: { y: 0.7 }
    //   });
    // }
  };

  return (
    <div className="w-[270px] mx-auto md:w-auto md:mx-0 bg-white/70 p-3 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
      {/* 이미지 */}
      <div className="relative w-[184px] h-[236px] mx-auto">
        <img
          src={data.image_url}
          alt="Avatar"
          className="object-contain w-full h-full rounded-xl overflow-hidden"
        />
      </div>

      {/* 내용 */}
      <div className="mt-2 flex flex-col gap-2">
        <div className="text-center">
          <span className="text-xs text-gray-500">
            참가자:
            <span className="ml-0.5 font-medium text-gray-800">
              {data.nickname}
            </span>
          </span>
        </div>

        <p className="h-[62px] overflow-y-auto text-sm text-gray-700 leading-relaxed px-3 py-2 bg-gray-100/80 rounded-lg text-center">
          {data.description || "등록된 설명이 없습니다."}
        </p>

        <Button
          type="button"
          size="icon"
          onClick={handleVote}
          className={`absolute -top-4 -right-4 w-auto max-w-[56px] px-4 pt-10 pb-8 mt-2 rounded-full font-bold transition-all flex flex-col items-center justify-center gap-1 border-2 active:scale-95 focus-visible:bg-blue-500 hover:bg-blue-500 ${
            isVoted
              ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200"
              : "bg-white border-blue-100 text-blue-500 hover:bg-blue-50 hover:border-blue-200"
          }`}
        >
          <Heart
            className={`size-5 transition-transform ${
              isVoted ? "fill-current scale-110" : "scale-100"
            }`}
          />
          <span className="text-lg tracking-tight">
            {data.votes.toLocaleString()}
          </span>
        </Button>
      </div>
    </div>
  );
}
