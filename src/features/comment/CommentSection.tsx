"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import { Button } from "@/shared/ui/button";
import { useUser } from "@/shared/hooks/useUser";
import { formatRelativeTime } from "@/shared/lib/formatters";
import { Trash2 } from "lucide-react";

export default function CommentSection({ entryId }: { entryId: number }) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const { data: comments, isPending } = useQuery({
    queryKey: ["comments", entryId],
    queryFn: async () => {
      const { data } = await supabase
        .from("best_dresser_comments")
        .select(`*`)
        .eq("entry_id", entryId)
        .order("created_at", { ascending: false });
      return data;
    },
  });

  const { mutate: addComment } = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("로그인이 필요합니다.");

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("nickname")
        .eq("id", user.id)
        .single();

      if (!profile) throw new Error("유저 정보를 찾을 수 없습니다.");

      const { error } = await supabase.from("best_dresser_comments").insert({
        entry_id: entryId,
        user_id: user.id,
        nickname: profile.nickname,
        content,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", entryId] });
    },
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId: string) => {
      await supabase.from("best_dresser_comments").delete().eq("id", commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", entryId] });
    },
  });

  return (
    <div className="bg-background rounded-2xl p-6 shadow-lg">
      <h3 className="font-bold mb-4 text-lg">댓글 {comments?.length || 0}</h3>

      <div className="flex gap-2 mb-6">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="💬 댓글 입력..."
          className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-pink-300"
        />
        <Button onClick={() => addComment(newComment)}>등록</Button>
      </div>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div
            key={comment.id}
            className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-pink-100 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* 헤더: 닉네임 + 시간 */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">
                    {comment.nickname}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>

                {/* 댓글 본문 */}
                <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              {/* 삭제 버튼: 본인 확인 로직 포함 & 호버 시 더 선명하게 */}
              {user?.id === comment.user_id && (
                <button
                  onClick={() => {
                    if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
                      deleteComment(comment.id);
                    }
                  }}
                  className="ml-4 text-gray-300 hover:text-red-400 p-1 transition-colors"
                  title="댓글 삭제"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* 댓글이 없을 경우 처리 */}
        {comments?.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            등록된 댓글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
