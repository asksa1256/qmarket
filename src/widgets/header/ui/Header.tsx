"use client";

import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/hooks/useUser";
import { toast } from "sonner";
import CreateInquiryModal from "@/features/inquiry/ui/CreateInquiryModal";
import CreateReportModal from "@/features/report/ui/CreateReportModal";
import { login, logout } from "@/features/sign-in-form/model/actions";
import DiscordIcon from "@/shared/assets/icons/DiscordIcon";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeQuestionMark } from "lucide-react";
import SearchInput from "@/features/item-search/ui/SearchInput";
import { useState } from "react";

export default function Header() {
  const [value, setValue] = useState("");

  const router = useRouter();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const handleSignIn = async () => {
    const res = await login();

    if (res.url) {
      window.location.href = res.url;
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("로그아웃 되었습니다.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <header className="relative py-8 px-4 md:px-0 max-w-5xl mx-auto flex items-center justify-between gap-4">
      {/* 로고 */}
      <div className="h-8 basis-[30%]"></div>

      {/* 메뉴 */}
      <div className="ml-auto flex gap-2 basis-[30%]">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-discord hover:bg-discord-hover flex gap-1 px-3 rounded-md items-center border-discord text-white text-sm">
              <figure className="overflow-hidden rounded-full w-6 h-6">
                <Image
                  src={user.user_metadata.avatar_url}
                  alt=""
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </figure>
              {user.user_metadata.custom_claims.global_name}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push("/my-items")}>
                내 아이템
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            className="bg-discord hover:bg-discord-hover"
            onClick={handleSignIn}
          >
            <DiscordIcon className="w-6 h-6 text-white" /> 로그인
          </Button>
        )}

        <Button
          size="icon"
          variant="outline"
          onClick={() => router.push("/faq")}
        >
          <BadgeQuestionMark />
        </Button>

        <CreateInquiryModal />

        {user && <CreateReportModal />}
      </div>
    </header>
  );
}
