"use client";

import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/providers/UserProvider";

export default function Header() {
  const router = useRouter();
  const user = useUser();

  return (
    <header className="py-8 max-w-4xl mx-auto flex items-center">
      <div className="ml-auto">
        {user ? (
          <span>{user.nickname ?? user.email}</span>
        ) : (
          <Button onClick={() => router.push("/signin")}>로그인</Button>
        )}
      </div>
    </header>
  );
}
