"use client";

import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/providers/UserProvider";
import { logout } from "@/features/sign-in-form/model/actions";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();
  const user = useUser();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <header className="py-8 max-w-4xl mx-auto flex items-center">
      <div className="ml-auto">
        {user ? (
          <>
            <span className="text-sm mr-4">
              <b>{user.nickname ?? user.email}</b>님, 환영합니다.
            </span>
            <Button onClick={handleSignOut}>로그아웃</Button>
          </>
        ) : (
          <Button onClick={() => router.push("/signin")}>로그인</Button>
        )}
      </div>
    </header>
  );
}
