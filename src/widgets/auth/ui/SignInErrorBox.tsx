"use client";

import Link from "next/link";

export default function SignInErrorBox({
  errorMessage,
}: {
  errorMessage: string | string[];
}) {
  console.log(errorMessage);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2>로그인 에러</h2>
      <p>메인으로 이동하여 다시 로그인을 시도해주세요.</p>
      <p>
        <Link href="/">메인으로</Link>
      </p>
    </div>
  );
}
