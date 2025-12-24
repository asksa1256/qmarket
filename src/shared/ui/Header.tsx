"use client";

import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/hooks/useUser";
import { toast } from "sonner";
import { login, logout } from "@/features/auth/signin/model/actions";
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
import { BadgeQuestionMark, Menu, LogOut, BookPlus } from "lucide-react";
import SearchBar from "@/features/item-search/ui/SearchBar";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./sheet";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { useState } from "react";
import { ALLOWED_RETURN_TO } from "../config/constants";

const DynamicSheetTrigger = dynamic(
  () => import("./sheet").then((mod) => mod.SheetTrigger),
  { ssr: false }
);

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const pathname = usePathname();

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

      // auth 가드 페이지일 경우, 메인 페이지로 리디렉션
      if (ALLOWED_RETURN_TO.has(pathname)) {
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <header className="sticky top-0 backdrop-blur-sm z-50">
      <div className="flex items-center justify-between py-2 lg:max-w-6xl mx-auto px-4 xl:px-0">
        <Link href="/" className="lg:w-[280px] md:w-[240px] shrink-0">
          <Image src="/images/logo.png" alt="큐마켓" width={140} height={54} />
        </Link>

        {/* Desktop View */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          {pathname !== "/" && (
            <SearchBar
              className={cn("mx-auto w-full max-w-xs [&_svg]:md:right-4", {
                hidden: pathname === "/",
              })}
            />
          )}

          <div
            className={cn("flex gap-2 shrink-0 justify-end", {
              "lg:w-[280px] md:w-[240px]": pathname !== "/",
              "w-full": pathname === "/",
            })}
          >
            {/* actions */}
            <Button
              size="icon"
              title="FAQ"
              variant="outline"
              onClick={() => {
                router.push("/faq");
                setIsSidebarOpen(false);
              }}
            >
              <BadgeQuestionMark />
            </Button>
            <Button
              size="icon"
              title="패치노트"
              variant="outline"
              onClick={() => {
                router.push("/patch-note");
                setIsSidebarOpen(false);
              }}
            >
              <BookPlus />
            </Button>

            {user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="shrink-0 bg-discord hover:bg-discord-hover flex gap-1 px-3 rounded-md items-center border-discord text-white text-sm">
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/my-items")}>
                    마이페이지
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
                style={{}}
                onClick={handleSignIn}
              >
                <DiscordIcon className="w-6 h-6 text-white" /> 로그인
              </Button>
            )}
          </div>
        </div>

        {/* Mobile View (Sidebar)  */}
        <div className="md:hidden">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <DynamicSheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-5" />
              </Button>
            </DynamicSheetTrigger>
            <SheetContent side="right" className="w-full max-w-[400px]">
              <SheetHeader className="text-left mb-6">
                <SheetTitle></SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6">
                <div className="px-4 flex flex-col gap-2">
                  <h3 className="font-bold text-base">검색</h3>
                  <SearchBar onSelect={() => setIsSidebarOpen(false)} />
                </div>

                <div className="flex flex-col gap-3 w-full">
                  {user ? (
                    <div className="flex flex-col gap-2 p-3 border bg-slate-50">
                      <div className="flex gap-2 justify-between">
                        <div className="flex gap-2 items-center">
                          <figure className="overflow-hidden rounded-full w-8 h-8">
                            <Image
                              src={user.user_metadata.avatar_url}
                              alt=""
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </figure>
                          <span className="font-semibold text-sm truncate w-[120px]">
                            {user.user_metadata.custom_claims.global_name}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              router.push("/my-items");
                              setIsSidebarOpen(false);
                            }}
                          >
                            마이페이지
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="bg-discord hover:bg-discord-hover w-auto mx-auto"
                      onClick={handleSignIn}
                    >
                      <DiscordIcon className="w-6 h-6 text-white mr-2" /> 로그인
                    </Button>
                  )}

                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      title="FAQ"
                      size="icon"
                      onClick={() => {
                        router.push("/faq");
                        setIsSidebarOpen(false);
                      }}
                    >
                      <BadgeQuestionMark />
                    </Button>
                    <Button
                      size="icon"
                      title="패치노트"
                      variant="outline"
                      onClick={() => {
                        router.push("/patch-note");
                        setIsSidebarOpen(false);
                      }}
                    >
                      <BookPlus />
                    </Button>
                  </div>
                </div>

                {user && (
                  <Button
                    variant="outline"
                    className="self-center"
                    onClick={handleSignOut}
                  >
                    <LogOut /> 로그아웃
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
