"use client";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { formatRelativeTime } from "@/shared/lib/formatters";
import Link from "next/link";
import CreateReportModal from "@/features/report/ui/CreateReportModal";
import { User } from "@supabase/supabase-js";
import { Comment } from "../model/commentTypes";

interface CommentItemProps {
  comment: Comment;
  user?: User | null;
  editingId: string | null;
  editContent: string;
  itemName?: string;
  itemGender?: string;
  setEditContent: (v: string) => void;
  onEditStart: (content: string) => void;
  onEditCancel: () => void;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onReplyClick?: () => void;
}

export default function CommentItem({
  comment,
  user,
  editingId,
  editContent,
  setEditContent,
  onEditStart,
  onEditCancel,
  onUpdate,
  onDelete,
  onReplyClick,
  itemName,
  itemGender
}: CommentItemProps) {
  const isEditing = editingId === comment.id;

  return (
    <div className="flex-1">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/user/${comment.user_id}`}
            className="font-bold text-sm text-gray-900 hover:text-blue-600 transition-colors"
          >
            {comment.nickname}
          </Link>
          <span className="text-[11px] text-gray-400">
            {formatRelativeTime(comment.created_at)}
          </span>

          <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 group-hover/reply:opacity-100 transition-opacity">
            {user && onReplyClick && !isEditing && (
              <button onClick={onReplyClick} className="text-[11px] text-gray-400 hover:text-blue-500">
                답글
              </button>
            )}
            {user?.id === comment.user_id && !isEditing && (
              <>
                <button onClick={() => onEditStart(comment.content)} className="text-[11px] text-gray-400 hover:text-blue-500">
                  수정
                </button>
                <button
                  onClick={() => confirm("댓글을 삭제하시겠습니까?") && onDelete()}
                  className="text-[11px] text-gray-400 hover:text-red-500"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        <div className="h-[20px] opacity-0 group-hover:opacity-100 group-hover/reply:opacity-100 transition-opacity">
          <CreateReportModal
            initialData={{
              report_category: "유저 신고",
              user_id: comment.user_id,
              item_name: itemName && itemGender ? `${itemName}(${itemGender})` : undefined,
              details: `댓글 내용: ${comment.content}`
            }}
          />
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3 mt-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onEditCancel}>취소</Button>
            <Button size="sm" onClick={() => onUpdate(editContent)}>수정 완료</Button>
          </div>
        </div>
      ) : (
        <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap break-all">
          {comment.content}
        </p>
      )}
    </div>
  );
}
