"use client";

import { useState, useEffect } from "react";
import { getUploadUrl } from "@/app/actions/s3-actions";
import { supabase } from "@/shared/api/supabase-client";
import { toast } from "sonner";

interface UploadedImage {
  id: number;
  transaction_image: string;
  created_at: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // DB에서 가져온 이미지 목록을 저장할 상태
  const [images, setImages] = useState<UploadedImage[]>([]);

  // 1. 컴포넌트 로드 시 데이터 가져오기
  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("s3_image_upload_test")
      .select("*")
      .order("created_at", { ascending: false }); // 최신순 정렬

    if (error) {
      console.error("데이터 로드 실패:", error);
    } else {
      setImages(data || []);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const { signedUrl, fileUrl } = await getUploadUrl(file.name, file.type);

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (uploadRes.ok) {
        // DB 저장
        const { error: dbError } = await supabase
          .from("s3_image_upload_test")
          .insert({ transaction_image: fileUrl });

        if (dbError) throw dbError;

        toast.success("업로드 및 DB 저장 완료!");
        setFile(null); // 파일 선택 초기화
        fetchImages(); // 리스트 갱신
      }
    } catch (error) {
      console.error("실패:", error);
      toast.error("처리 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col gap-8">
      {/* 업로드 섹션 */}
      <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
          />
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
          >
            {uploading ? "업로드 중..." : "S3에 업로드"}
          </button>
        </div>
      </div>

      <hr />

      {/* DB 데이터 리스트 섹션 */}
      <div>
        <h3 className="text-xl font-bold mb-6">Supabase DB 이미지 목록</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.length > 0 ? (
            images.map((img) => (
              <div
                key={img.id}
                className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img
                    src={img.transaction_image}
                    alt={`Upload ${img.id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400">
                    등록일: {new Date(img.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">저장된 이미지가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
