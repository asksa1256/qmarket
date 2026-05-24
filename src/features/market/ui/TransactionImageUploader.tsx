"use client";

import { ChangeEvent, useState } from "react";
import { uploadTransactionImage } from "@/app/actions/storage-actions";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
      const formData = new FormData();
      formData.append("file", file);

      const publicUrl = await uploadTransactionImage(formData);

      onUpload?.(publicUrl);
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
