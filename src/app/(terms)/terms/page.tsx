"use client";

import { useState } from "react";
import TermsOfUseContent from "@/features/terms/ui/TermsOfUseContent";
import PrivacyPolicyContent from "@/features/terms/ui/PrivacyPolicyContent";

export default function TermsAndPrivacyPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 탭 버튼 */}
        <div className="bg-white rounded-t-lg shadow-sm">
          <div className="flex gap-2 p-5 pb-0">
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-6 py-3 font-medium text-base transition-all border-b-2 ${
                activeTab === "terms"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              이용 약관
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-6 py-3 font-medium text-base transition-all border-b-2 ${
                activeTab === "privacy"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              개인정보 처리방침
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="bg-white rounded-b-lg shadow-sm p-8 md:p-12">
          {activeTab === "terms" ? (
            <TermsOfUseContent />
          ) : (
            <PrivacyPolicyContent />
          )}
        </div>
      </div>
    </div>
  );
}
