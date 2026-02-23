"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import { Button } from "@/shared/ui/button";
import { useUser } from "@/shared/hooks/useUser";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentFormValues, commentFormSchema } from "../model/commentSchema";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "sonner";
import { Loader2, MessageSquare, CornerDownRight, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { login } from "@/features/auth/signin/model/actions";
import { Comment, OrganizedComment } from "../model/commentTypes";
import CommentItem from "./CommentItem";

interface ItemCommentSectionProps {
  itemId: string;
  itemName: string;
  itemGender: string;
}

export default function ItemCommentSection({
  itemId,
  itemName,
  itemGender
}: ItemCommentSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const pathname = usePathname();

  const queryClient = useQueryClient();
  const { data: user } = useUser();

  // 메인 댓글용 폼
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { content: "" },
  });

  // 댓글 조회
  const { data: comments, isPending } = useQuery<Comment[]>({
    queryKey: ["item-comments", itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("item_comments")
        .select(`*`)
        .eq("item_id", itemId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
      return data as Comment[];
    },
  });

  // 계층 구조 데이터 가공 최적화
  const organizedComments = useMemo<OrganizedComment[]>(() => {
    if (!comments) return [];
    const parents = comments.filter(c => !c.parent_id);
    return parents.map(parent => ({
      ...parent,
      replies: comments.filter(c => c.parent_id === parent.id)
    }));
  }, [comments]);

  // 댓글/답글 등록
  const { mutate: addComment } = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string | null }) => {
      if (!user) throw new Error("로그인이 필요합니다.");

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("nickname")
        .eq("id", user.id)
        .single();

      if (!profile) throw new Error("유저 정보를 찾을 수 없습니다.");

      const { error } = await supabase.from("item_comments").insert({
        item_id: itemId,
        user_id: user.id,
        nickname: profile.nickname,
        content: content,
        parent_id: parentId || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      reset();
      setReplyingId(null);
      queryClient.invalidateQueries({ queryKey: ["item-comments", itemId] });
      toast.success("댓글이 등록되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "댓글 등록에 실패했습니다.");
    },
  });

  // 댓글 수정
  const { mutate: updateComment } = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from("item_comments")
        .update({ content })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["item-comments", itemId] });
      toast.success("댓글이 수정되었습니다.");
    },
  });

  // 댓글 삭제
  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("item_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-comments", itemId] });
      toast.success("댓글이 삭제되었습니다.");
    },
  });

  const handleSignIn = async () => {
    const res = await login(pathname);
    if (res.url) window.location.href = res.url;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="size-5 text-gray-700" />
        <h3 className="font-bold text-lg">댓글 {comments?.length || 0}</h3>
      </div>

      <div className="mb-2">
        {user ? (
          <form
            className="flex gap-2"
            onSubmit={handleSubmit((v) => addComment({ content: v.content }))}
          >
            <div className="flex-1">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="내용을 입력해주세요."
                    disabled={isSubmitting}
                    className="resize-none min-h-[80px]"
                  />
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-auto px-6"
            >
              등록
            </Button>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 border border-dashed border-gray-200 flex flex-col items-center gap-3">
            <p className="text-gray-500 text-sm">로그인 후 아이템 댓글을 등록할 수 있습니다.</p>
            <Button onClick={handleSignIn} size="sm" className="gap-2">
              <LogIn className="size-4" /> 로그인
            </Button>
          </div>
        )}
      </div>

      {isPending && (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <Loader2 className="animate-spin text-blue-500" />
          <p className="text-sm text-gray-400">댓글을 불러오는 중입니다...</p>
        </div>
      )}

      <div className="space-y-1">
        {organizedComments.map((parent) => (
          <div key={parent.id} className="flex flex-col">
            <div className="group border-b border-gray-50 py-6 last:border-0 relative">
              <CommentItem
                comment={parent}
                user={user}
                editingId={editingId}
                editContent={editContent}
                setEditContent={setEditContent}
                onEditStart={(content) => {
                  setEditingId(parent.id);
                  setEditContent(content);
                  setReplyingId(null);
                }}
                onEditCancel={() => setEditingId(null)}
                onUpdate={(content) => updateComment({ id: parent.id, content })}
                onDelete={() => deleteComment(parent.id)}
                onReplyClick={() => setReplyingId(parent.id)}
                itemName={itemName}
                itemGender={itemGender}
              />

              {/* 답글 입력 폼 */}
              {replyingId === parent.id && (
                <div className="mt-4 ml-8 pl-4 border-l-2 border-gray-100">
                  <ReplyForm
                    onCancel={() => setReplyingId(null)}
                    onSubmit={(content) => addComment({ content, parentId: parent.id })}
                  />
                </div>
              )}

              {/* 답글 목록 */}
              {parent.replies.map(reply => (
                <div key={reply.id} className="ml-8 mt-2 flex gap-2 relative group/reply">
                  <CornerDownRight className="size-4 text-gray-300 shrink-0 mt-1" />
                  <div className="flex-1 bg-gray-50/50 p-4 rounded-lg relative">
                    <CommentItem
                      comment={reply}
                      user={user}
                      editingId={editingId}
                      editContent={editContent}
                      setEditContent={setEditContent}
                      onEditStart={(content) => {
                        setEditingId(reply.id);
                        setEditContent(content);
                        setReplyingId(null);
                      }}
                      onEditCancel={() => setEditingId(null)}
                      onUpdate={(content) => updateComment({ id: reply.id, content })}
                      onDelete={() => deleteComment(reply.id)}
                      itemName={itemName}
                      itemGender={itemGender}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {!isPending && comments?.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            등록된 댓글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyForm({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (content: string) => void }) {
  const { handleSubmit, control, formState: { isSubmitting } } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { content: "" },
  });

  return (
    <form className="flex gap-2" onSubmit={handleSubmit((v) => onSubmit(v.content))}>
      <div className="flex-1">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              autoFocus
              placeholder="답글을 입력하세요..."
              className="resize-none min-h-[60px] text-sm"
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Button type="submit" disabled={isSubmitting} size="sm">등록</Button>
        <Button variant="ghost" type="button" size="sm" onClick={onCancel}>취소</Button>
      </div>
    </form>
  );
}
