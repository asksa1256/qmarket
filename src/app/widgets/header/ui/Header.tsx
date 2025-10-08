"use client";

import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/providers/UserProvider";
import { logout } from "@/features/sign-in-form/model/actions";
import { toast } from "sonner";
import Link from "next/link";
import CreateInquiryModal from "@/features/inquiry/ui/CreateInquiryModal";
import CreateReportModal from "@/features/report/ui/CreateReportModal";
import { login } from "@/features/sign-in-form/model/actions";

export default function Header() {
  const router = useRouter();
  const user = useUser();

  const handleSignIn = async () => {
    const res = await login();

    if (res.url) {
      window.location.href = res.url;
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <header className="py-8 max-w-4xl mx-auto flex items-center justify-between">
      <Link href="/" className="text-3xl text-blue-600 font-bold">
        Q-Market
      </Link>

      <div className="ml-auto flex gap-2">
        {user ? (
          <div className="flex gap-2 items-center">
            <span className="text-sm mr-4">
              로그인 유저: <b>{user.nickname ?? user.email}</b>
            </span>
            <Button variant="outline" onClick={() => router.push("/my-items")}>
              내 아이템
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              로그아웃
            </Button>
          </div>
        ) : (
          <Button onClick={handleSignIn}>로그인</Button>
        )}

        <CreateInquiryModal />

        {user && <CreateReportModal />}
      </div>
    </header>
  );
}
