"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/shared/api/supabase-client";
import EntryCard from "@/features/best-dresser/ui/EntryCard";
import UploadModal from "@/features/best-dresser/ui/UploadModal";
import { BestDresserEntry } from "@/features/best-dresser/model/bestDresserType";

export default function BestDresserPage() {
  const [entries, setEntries] = useState<BestDresserEntry[]>([]);

  // 데이터 불러오기
  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("best_dresser")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setEntries(data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
            🌈 이달의 베스트 드레서 🌈
          </h1>
          <p className="text-lg text-gray-600">
            여러분의 멋진 게임 아바타를 뽐내고 투표를 받아보세요!
          </p>
        </header>

        {/* 업로드 */}
        <div className="flex justify-center mb-12">
          <UploadModal onUploadSuccess={fetchEntries} />
        </div>

        {/* 컨테스트 참가자 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              data={entry}
              onVoteSuccess={fetchEntries}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
