"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";

export default function SignInErrorBox({
  errorMessage,
}: {
  errorMessage: string | string[];
}) {
  console.log(errorMessage);

  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", pathname);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center">
      <h2>로그인 에러</h2>
      <p>메인으로 이동하여 다시 로그인을 시도해주세요.</p>
      <ButtonToMain />
    </div>
  );
}
