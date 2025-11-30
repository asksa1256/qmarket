"use client";

import { Button } from "@/shared/ui/button";
import { login } from "@/features/auth/signin/model/actions";

const invite = "https://discord.com/invite/UKE4xj5pVN";

export default function DiscordJoinPage() {
  const handleReSignIn = async () => {
    const res = await login();

    if (res.url) {
      window.location.href = res.url;
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="flex flex-col items-center max-w-2xl w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="flex gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white mb-4">
              <b>큐플레이 아카이브</b> 서버 가입하기
            </h1>
            <p className="mt-1 text-sm text-white/70">
              다중 가입을 방지하기 위한 과정입니다.
              <br /> 아래 버튼을 눌러 큐플레이 아카이브 서버에 참여해주신 후,
              다시 로그인을 시도해주세요.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href={invite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-500/95 hover:bg-indigo-600 transition text-white font-medium py-3 px-4 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v14m7-7H5"
              />
            </svg>
            서버 가입하기
          </a>
        </div>

        <div className="mt-6 text-xs text-white/60 text-center">
          <p>
            추가 링크:{" "}
            <span className="break-all">
              https://maplestoryworlds.nexon.com/ko/play/2f1e5b3cc6894b00bd4c2624586f0d20/
            </span>
          </p>
          <p className="mt-2">문제시 위 링크에서 서버 가입을 진행해주세요.</p>
        </div>

        <div className="mt-6 text-xs">
          <p className="mt-1 text-sm text-white/70">
            서버 가입을 완료하셨나요?{" "}
            {/* <Link href="/" className="underline underline-offset-4 text-white">
              메인 페이지로 이동
            </Link> */}
            <Button
              variant="link"
              className="text-white px-0"
              onClick={handleReSignIn}
            >
              다시 로그인하기
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
