"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import { Button } from "@/shared/ui/button";
import { useUser } from "@/shared/hooks/useUser";
import { formatRelativeTime } from "@/shared/lib/formatters";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentFormValues, commentFormSchema } from "../model/commentSchema";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CommentSection({ entryId }: { entryId: number }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { content: "" },
  });

  const queryClient = useQueryClient();
  const { data: user } = useUser();

  // 댓글 조회
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

  // 댓글 등록
  const { mutate: addComment } = useMutation({
    mutationFn: async (values: CommentFormValues) => {
      if (!user) {
        toast.error("로그인이 필요합니다.");
        return;
      }

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
        content: values.content,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["comments", entryId] });
    },
  });

  // 댓글 수정
  const { mutate: updateComment } = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from("best_dresser_comments")
        .update({ content })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["comments", entryId] });
    },
  });

  // 댓글 삭제
  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId: string) => {
      await supabase.from("best_dresser_comments").delete().eq("id", commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", entryId] });
    },
  });

  const handleStartEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  return (
    <div className="bg-background rounded-2xl p-6 shadow-lg">
      <h3 className="font-bold mb-4 text-lg">댓글 {comments?.length || 0}</h3>

      <form
        className="flex gap-2 mb-6"
        onSubmit={handleSubmit((v) => addComment(v))}
      >
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="content"
              placeholder="💬 댓글 입력..."
              disabled={isSubmitting}
              className="resize-none"
            />
          )}
        />
        <Button type="submit" disabled={isSubmitting || !user}>
          등록
        </Button>
      </form>

      {isPending && (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-pink-500" />
          <p className="text-sm text-foreground/50">로딩중...</p>
        </div>
      )}

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="...">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {editingId === comment.id ? (
                  // 댓글 수정
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px] border-pink-200 focus-visible:ring-pink-400"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        취소
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateComment({
                            id: comment.id,
                            content: editContent,
                          })
                        }
                      >
                        수정
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 댓글 조회
                  <>
                    <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-sm text-gray-900">
                        {comment.nickname}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {formatRelativeTime(comment.created_at)}
                      </span>

                      {user?.id === comment.user_id && (
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() =>
                              handleStartEdit(comment.id, comment.content)
                            }
                            className="text-[11px] text-gray-400 hover:text-blue-500"
                          >
                            수정
                          </button>
                          <button
                            onClick={() =>
                              confirm("삭제하시겠습니까?") &&
                              deleteComment(comment.id)
                            }
                            className="text-[11px] text-gray-400 hover:text-red-500"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
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
