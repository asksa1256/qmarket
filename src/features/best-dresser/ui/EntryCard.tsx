"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import { BestDresserEntry } from "../model/bestDresserType";
import { Button } from "@/shared/ui/button";
import { InfiniteData } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Heart, MessageCircleMoreIcon, Pencil, Trash2 } from "lucide-react";
import HeartFill from "@/shared/ui/Icon/HeartFill";
import { formatRelativeTime } from "@/shared/lib/formatters";
import Link from "next/link";
import EntryEditModal from "./EntryEditModal";
import { deleteS3Image } from "@/app/actions/best-dresser-actions";
import { restoreEntryCountAction } from "@/app/actions/best-dresser-actions";
import { cn } from "@/shared/lib/utils";

interface EntryCardProps {
  data: BestDresserEntry;
  user: User | null;
  rank: number;
  disabled?: boolean;
}

// rank 값에 따른 스타일 분기: 컨테스트 마감 후 결과 페이지에서 적용
// const getRankStyles = (r: number | undefined) => {
//   switch (r) {
//     case 0: // 1위
//       return "ring-4 ring-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.5)] bg-gradient-to-b from-yellow-50 to-white scale-[1.02] z-10";
//     case 1: // 2위
//       return "ring-4 ring-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.3)] bg-gradient-to-b from-slate-50 to-white";
//     case 2: // 3위
//       return "ring-4 ring-amber-900/30 shadow-[0_0_15px_rgba(134, 75, 36, 0.2)] bg-gradient-to-b from-amber-50 to-white";
//     default:
//       return "bg-white/70 border border-white/50";
//   }
// };

export default function EntryCard({
  data,
  user,
  rank,
  disabled,
}: EntryCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const commentCount = data.comments_count?.[0]?.count || 0;

  // 참가자 본인 확인
  const isWriter = user?.id === data.user_id;

  // 참가 게시글 삭제
  const handleDelete = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!confirm("게시글을 삭제하시겠습니까? 댓글도 함께 삭제됩니다.")) return;

    try {
      // 1. 등록 횟수 먼저 복원 시도
      const redisResult = await restoreEntryCountAction(user.id);

      if (!redisResult.success) {
        toast.error("참여 횟수 복원에 실패하여 삭제를 중단합니다.");
        return; // 복원 안 되면 삭제도 안 함
      }

      // 2. 복원 성공 후 DB 데이터 삭제
      const { error: dbError } = await supabase
        .from("best_dresser")
        .delete()
        .eq("id", data.id)
        .eq("user_id", user.id);

      if (dbError) {
        throw dbError;
      }

      // 3. 성공 알림 및 리액트 쿼리 갱신
      const count =
        "remainingCount" in redisResult ? redisResult.remainingCount : 3;
      toast.success(`삭제 완료! (잔여 횟수: ${count}회)`);
      queryClient.invalidateQueries({ queryKey: ["best_dresser"] });
      queryClient.invalidateQueries({ queryKey: ["remainingCount", user?.id] });

      // 4. DB 삭제 후 S3 이미지 삭제 (이미지 삭제 실패 시 콘솔 에러로만 표시)
      const s3Result = await deleteS3Image(data.image_url);
      if (!s3Result.success) {
        console.error("S3 삭제 실패 (수동 확인 필요):", s3Result.error);
      }
    } catch (error) {
      console.error("삭제 중 에러 발생:", error);
      toast.error("게시글 삭제에 실패했습니다.");
    }
  };

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
      if (!user) {
        toast.error("로그인이 필요합니다.");
        return;
      }

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
  };

  // const isTopRank = rank >= 0 && rank <= 2;
  // const rankLabels = ["🥇 1등", "🥈 2등", "🥉 3등"];

  return (
    <>
      <Link href={`/best-dresser/${data.id}`}>
        <div
          // className={`hover:scale-105 transition-transform w-[270px] mx-auto md:w-auto md:mx-0 p-3 backdrop-blur-md rounded-2xl shadow-xl ${getRankStyles(
          //   rank
          // )}`}
          className="bg-white hover:scale-105 transition-transform w-[270px] mx-auto md:w-auto md:mx-0 p-3 backdrop-blur-md rounded-2xl shadow-xl"
        >
          {/* 1, 2, 3위 뱃지 */}
          {/* {isTopRank && (
            <span
              className={`absolute -top-8.5 left-4 px-3 pb-1 pt-1.5 rounded-tl-xl rounded-tr-xl text-sm font-black ${
                rank === 0
                  ? "bg-yellow-400 text-yellow-900"
                  : rank === 1
                  ? "bg-slate-400 text-white"
                  : "bg-amber-900/50 text-white"
              }`}
            >
              {rankLabels[rank]}
            </span>
          )} */}

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
            <p className="h-[62px] overflow-y-auto text-sm text-gray-700 leading-relaxed px-3 py-2 bg-gray-100/80 rounded-lg">
              {data.description || "등록된 설명이 없습니다."}
            </p>

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-foreground/50">
                참가자:
                <span className="ml-0.5 font-medium text-gray-800">
                  {data.nickname}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <span className="text-foreground/50">
                  등록:
                  <span className="ml-0.5">
                    {formatRelativeTime(data.created_at)}
                  </span>
                </span>

                {/* 댓글 수 */}
                {commentCount > 0 && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <MessageCircleMoreIcon className="size-3.5" />
                    <span className="font-medium">댓글 {commentCount}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="button"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleVote();
              }}
              disabled={disabled}
              className={cn(
                "absolute z-1 -top-10 -right-5 w-auto max-w-[56px] px-4 py-8 mt-2 rounded-full font-bold transition-all flex flex-col items-center justify-center gap-1 border-2 active:scale-95 focus-visible:bg-blue-500 bg-white border-blue-100 text-blue-500 hover:bg-blue-50 hover:border-blue-200 disabled:opacity-100",
                {
                  "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200":
                    isVoted,
                }
              )}
            >
              {!disabled ? (
                <Heart
                  className={cn("size-5 transition-transform", {
                    "fill-current scale-110": isVoted,
                  })}
                />
              ) : (
                <HeartFill className="size-5 text-blue-500" />
              )}

              <span className="tracking-tight">{data.votes}</span>
            </Button>

            {isWriter && (
              <div className="flex flex-col">
                {/* 수정 버튼 */}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={(e) => {
                    // Link의 기본 동작(페이지 이동) 막기
                    e.preventDefault();
                    // 클릭 이벤트 부모 Link로 버블링 방지
                    e.stopPropagation();

                    setIsEditOpen(true);
                  }}
                  className="group absolute z-1 top-10 -right-5 size-[56px] rounded-full font-bold transition-all flex flex-col items-center justify-center gap-1 border-2 focus-visible:bg-blue-100 hover:bg-blue-100 hover:border-blue-200"
                >
                  <Pencil className="group-hover:text-blue-500 size-4" />
                </Button>

                {/* 삭제 버튼 */}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="group absolute z-1 top-25 -right-5 size-[56px] rounded-full font-bold transition-all flex flex-col items-center justify-center gap-1 border-2 focus-visible:bg-red-100 hover:bg-red-100 hover:border-red-200"
                >
                  <Trash2 className="group-hover:text-red-500 size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* 분리된 수정 모달 호출 */}
      <EntryEditModal open={isEditOpen} setOpen={setIsEditOpen} data={data} />
    </>
  );
}
