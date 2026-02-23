import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Menu, BadgeQuestionMark, BookPlus, LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/sheet";
import SearchBar from "@/features/item-search/ui/SearchBar";
import DiscordIcon from "@/shared/assets/icons/DiscordIcon";
import { login, logout } from "@/features/auth/signin/model/actions";
import { ALLOWED_RETURN_TO } from "@/shared/config/constants";

const DynamicSheetTrigger = dynamic(
  () => import("@/shared/ui/sheet").then((mod) => mod.SheetTrigger),
  { ssr: false }
);

interface MobileNavProps {
  user: User | null | undefined;
}

export default function MobileNav({ user }: MobileNavProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
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

      if (ALLOWED_RETURN_TO.has(pathname)) {
        router.replace("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
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
  );
}
