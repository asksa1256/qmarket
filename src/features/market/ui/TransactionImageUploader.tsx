"use client";

import { ChangeEvent, useState } from "react";
import { supabase } from "@/shared/api/supabase-client";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const BUCKET = "transaction_images";

function sanitizeFileName(name: string): string {
  const ext = name.includes(".") ? name.split(".").pop()! : "";
  const base = ext ? name.slice(0, -(ext.length + 1)) : name;
  const safeBase = base
    .replace(/[^\w\s-]/g, "")  // 영문, 숫자, _-, 공백 외 제거 (한글 포함)
    .replace(/\s+/g, "_")       // 공백 → 언더스코어
    .replace(/^_+|_+$/g, "")   // 앞뒤 언더스코어 제거
    || Date.now().toString();   // 빈 문자열이면 타임스탬프로 대체
  return ext ? `${safeBase}.${ext}` : safeBase;
}

export default function TransactionImageUploader({
  onUpload,
  onFileChange,
}: {
  onUpload?: (v: string) => void;
  onFileChange?: (v: File | undefined) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.size > MAX_FILE_SIZE) {
      toast.error(`2MB 이하의 파일을 선택해주세요.`);
      e.target.value = "";
    }

    setFile(e.target.files?.[0] || null);
    setIsSucceeded(false);

    onFileChange?.(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setIsSucceeded(false);

    try {
      const path = `uploads/${Date.now()}-${sanitizeFileName(file.name)}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type });

      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

      onUpload?.(data.publicUrl);
      toast.success("거래 인증 등록에 성공했습니다.");
      setIsSucceeded(true);
    } catch (error) {
      console.error("실패:", error);
      toast.error("등록 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || isSucceeded}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 disabled:file:text-foreground/50 disabled:file:bg-gray-200"
        />
        <Button
          onClick={handleUpload}
          disabled={uploading || !file || isSucceeded}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
        >
          {uploading ? "등록 중..." : isSucceeded ? "등록 완료" : "인증 등록"}
        </Button>
      </div>
    </div>
  );
}
