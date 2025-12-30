"use client";

import Image from "next/image";
import { UserDetail } from "../model/userTypes";
import UserBioForm from "./UserBioForm";
import { copyToClipboard } from "@/shared/lib/copyToClipboard";
import { Button } from "@/shared/ui/button";
import { getDailyItemCountAction } from "@/app/actions/item-actions";
import DailyLimitDisplay from "@/features/user/ui/DailyLimitDisplay";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/shared/hooks/useUser";
import { usePathname } from "next/navigation";
import { Copy } from "lucide-react";
import TransactionCountDisplay from "./TransactionsCountDisplay";

export default function UserProfileCard({ user }: { user: UserDetail }) {
  const { data: loginUser } = useUser();
  const pathname = usePathname();

  // 일일 등록 잔여 횟수 조회
  const { data: limitStatus, isPending } = useQuery({
    queryKey: ["item-create-limit-count", user.id],
    queryFn: getDailyItemCountAction,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return (
    <div className="text-center">
      <div className="mb-4 text-xs bg-secondary rounded-sm p-1 flex flex-col items-center">
        <h6>프로필코드</h6>
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 text-xs font-normal h-auto hover:bg-transparent"
            onClick={() =>
              copyToClipboard(user.id, "프로필코드가 복사되었습니다.")
            }
          >
            <span className="shrink-0">{user.id}</span>
            <Copy className="size-3" />
          </Button>
        </div>
      </div>

      <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden mb-4 mx-auto">
        <Image
          src={user.discord_profile_image ?? "images/discord-default.png"}
          alt={user.username}
          fill
          className="object-cover"
        />
      </div>

      <div className="mb-2">
        <h4 className="font-bold text-foreground mb-1 md:text-xl text-lg">
          {user.nickname}
        </h4>
        <h5 className="text-foreground/70 text-sm">
          <Button
            type="button"
            variant="link"
            className="px-0 py-0 h-auto text-foreground/70 font-normal"
            onClick={() =>
              copyToClipboard(
                user.username,
                "디스코드 아이디가 복사되었습니다."
              )
            }
          >
            {user.username}
            <Copy className="size-3" />
          </Button>
        </h5>
      </div>

      <UserBioForm user={user} />

      {pathname === "/my-items" && loginUser?.id === user.id && (
        <div className="mt-3 flex justify-center">
          <DailyLimitDisplay
            remaining={limitStatus?.remaining || 0}
            isLoading={isPending}
          />
        </div>
      )}

      {/* 인증 횟수 / 거래 완료 횟수 */}
      <TransactionCountDisplay userId={user.id} />

      <span className="block text-sm text-gray-400 pt-3 mt-4 border-t border-gray-200">
        가입일: {user.created_at.slice(0, 10)}
      </span>
    </div>
  );
}
