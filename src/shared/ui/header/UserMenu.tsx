import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { logout, login } from "@/features/auth/signin/model/actions";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import DiscordIcon from "@/shared/assets/icons/DiscordIcon";
import { ALLOWED_RETURN_TO } from "@/shared/config/constants";
import { usePathname } from "next/navigation";

interface UserMenuProps {
  user: User | null | undefined;
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
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

      if (ALLOWED_RETURN_TO.has(pathname)) {
        router.replace("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!user) {
    return (
      <Button
        className="bg-discord hover:bg-discord-hover"
        onClick={handleSignIn}
      >
        <DiscordIcon className="w-6 h-6 text-white" /> 로그인
      </Button>
    );
  }

  return (
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
  );
}
