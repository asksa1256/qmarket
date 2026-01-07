"use client";

import { useState, useEffect } from "react";
import { BookPlus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { useLatestPatchNote } from "../model/useLatestPatchNote";

interface PatchNoteButtonProps {
  onClose?: () => void;
}

export default function PatchNoteButton({ onClose }: PatchNoteButtonProps) {
  const [hasNewPatchNote, setHasNewPatchNote] = useState(false);
  const router = useRouter();
  const { data: latestDate } = useLatestPatchNote();

  useEffect(() => {
    if (!latestDate) return;

    const latestPatchNoteDate = new Date(latestDate).getTime();
    const lastVisitedStr = localStorage.getItem("lastPatchNoteVisit");
    const lastVisited = lastVisitedStr ? parseInt(lastVisitedStr) : 0;

    if (latestPatchNoteDate > lastVisited) {
      setHasNewPatchNote(true);
    }
  }, [latestDate]);

  const handleClick = () => {
    localStorage.setItem("lastPatchNoteVisit", Date.now().toString());
    setHasNewPatchNote(false);
    router.push("/patch-note");
    onClose?.(); // 사이드바 닫기
  };

  return (
    <Button
      size="icon"
      title="패치노트"
      variant="outline"
      className="relative"
      onClick={handleClick}
    >
      <BookPlus />
      {hasNewPatchNote && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
      )}
    </Button>
  );
}
