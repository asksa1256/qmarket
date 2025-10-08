"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkDiscordMember } from "@/features/sign-in-form/model/actions";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Discord 멤버십 확인 중...");

  useEffect(() => {
    const verifyMembership = async () => {
      const result = await checkDiscordMember();

      if (result.isMember) {
        setStatus("✅ 디스코드 인증이 완료되었습니다. 감사합니다.");
        router.push("/");
      } else {
        setStatus(
          "❌ 디스코드 인증에 실패했습니다. 서버 가입 페이지로 이동합니다."
        );
        console.log(`🚨 ${result.error}`);

        setTimeout(() => {
          router.push("/discord-join");
        }, 2000);
      }
    };

    verifyMembership();
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">디스코드 로그인 확인</h1>
      <p className="mt-4">{status}</p>
    </div>
  );
}
