"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { type CheckedState } from "@radix-ui/react-checkbox";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLatestPatchNote } from "../model/useLatestPatchNote";

const POPUP_STORAGE_KEY = "hide_patch_note_2026.02.23";

// 팝업 일주일 뒤 만료
const EXPIRATION_DATE = new Date("2026-03-02T00:00:00Z").getTime();

export default function PatchNotePopup() {
  const [open, setOpen] = useState(false);
  const [hidePopup, setHidePopup] = useState(false);
  const { data: latestDate } = useLatestPatchNote();
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    // 팝업 만료 확인
    if (Date.now() > EXPIRATION_DATE) {
      return;
    }

    // 사용자가 팝업을 숨기기로 선택했는지 확인
    const isHidden = localStorage.getItem(POPUP_STORAGE_KEY);
    if (isHidden) {
      return;
    }

    setOpen(true);
  }, []);

  const handleClose = () => {
    if (hidePopup) {
      localStorage.setItem(POPUP_STORAGE_KEY, "true");
    }
    setOpen(false);
  };

  const handleGoToPatchNote = (e: React.MouseEvent) => {
    e.preventDefault();

    if (latestDate) {
      localStorage.setItem(
        "lastPatchNoteVisit",
        new Date(latestDate).getTime().toString()
      );
      window.dispatchEvent(new Event("patchNoteVisited"));
    }
    handleClose();

    startTransition(() => {
      router.push("/patch-note");
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border-0 shadow-2xl bg-gradient-to-br from-indigo-50/90 via-white to-white backdrop-blur-md">
        <DialogHeader className="mb-2">
          <div className="mx-auto bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold w-fit mb-3">
            UPDATE
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-gray-900 text-center leading-tight">
            아이템 상세 페이지
            <br />
            댓글 시스템 추가
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            2026.02.23 패치
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm text-gray-600 break-keep leading-relaxed">
          <div className="bg-white/80 p-4 rounded-2xl border border-indigo-50 shadow-sm space-y-3">
            <ul className="list-disc list-inside text-gray-700 ml-1">
              <li>아이템 상세 페이지 하단에 <strong>댓글 영역</strong> 추가</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-3 sm:gap-3">
          <Link href="/patch-note" className="w-full" onClick={handleGoToPatchNote}>
            <Button className="w-full rounded-xl py-6 text-base font-semibold shadow-md bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transition-all">
              패치노트 보러 가기
            </Button>
          </Link>

          <div className="flex items-center justify-between w-full mt-2 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hidePopup"
                checked={hidePopup}
                onCheckedChange={(checked: CheckedState) => setHidePopup(checked === true)}
                className="border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
              />
              <label
                htmlFor="hidePopup"
                className="text-sm font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
              >
                그만 보기
              </label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-900 rounded-lg"
            >
              닫기
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
