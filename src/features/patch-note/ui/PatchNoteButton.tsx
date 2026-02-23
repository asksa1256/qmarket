"use client";

import { useState, useEffect } from "react";
import { BookPlus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { useLatestPatchNote } from "../model/useLatestPatchNote";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

interface Props {
  onClose?: () => void;
}

export default function PatchNoteButton({ onClose }: Props) {
  const [hasNewPatchNote, setHasNewPatchNote] = useState(false);
  const router = useRouter();
  const { data: latestDate } = useLatestPatchNote();

  useEffect(() => {
    const checkBadge = () => {
      if (!latestDate) return;

      const latestPatchNoteDate = new Date(latestDate).getTime();
      const lastVisitedStr = localStorage.getItem("lastPatchNoteVisit");
      const lastVisited = lastVisitedStr ? parseInt(lastVisitedStr) : 0;

      if (latestPatchNoteDate > lastVisited) {
        setHasNewPatchNote(true);
      } else {
        setHasNewPatchNote(false);
      }
    };

    checkBadge();

    window.addEventListener("patchNoteVisited", checkBadge);
    return () => window.removeEventListener("patchNoteVisited", checkBadge);
  }, [latestDate]);

  const handleClick = () => {
    if (latestDate) {
      localStorage.setItem(
        "lastPatchNoteVisit",
        new Date(latestDate).getTime().toString()
      );
    }
    setHasNewPatchNote(false);
    router.push("/patch-note");
    onClose?.(); // 사이드바 닫기
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent>패치노트</TooltipContent>
    </Tooltip>
  );
}
