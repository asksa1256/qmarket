"use client";

import Image from "next/image";
import { UserDetail } from "../model/userTypes";
import UserBioForm from "./UserBioForm";
import { copyToClipboard } from "@/shared/lib/copyToClipboard";
import { Button } from "@/shared/ui/button";
import { getDailyItemCountAction } from "@/app/actions/item-actions";
import DailyLimitDisplay from "@/features/item/ui/DailyLimitDisplay";
import { useQuery } from "@tanstack/react-query";

export default function UserProfileCard({ user }: { user: UserDetail }) {
  // 일일 등록 잔여 횟수 조회
  const { data: limitStatus } = useQuery({
    queryKey: ["item-create-limit-count", user.id],
    queryFn: getDailyItemCountAction,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return (
    <div className="text-center">
      <Image
        src={user.discord_profile_image ?? "images/empty.png"}
        alt={user.username}
        width={120}
        height={120}
        className="rounded-full border-4 border-blue-500 mb-5 mx-auto object-cover block"
      />

      <div className="mb-2">
        <h4 className="font-bold text-foreground mb-1 md:text-xl text-lg">
          {user.nickname}
        </h4>
        <h5 className="text-foreground/70 text-sm">
          @
          <Button
            type="button"
            variant="link"
            className="px-0 py-0 h-auto text-foreground/70"
            onClick={() =>
              copyToClipboard(
                user.username,
                "디스코드 아이디가 복사되었습니다."
              )
            }
          >
            {user.username}
          </Button>
        </h5>
      </div>

      <UserBioForm user={user} />

      <div className="mt-2 flex justify-center">
        <DailyLimitDisplay remaining={limitStatus?.remaining || 0} />
      </div>

      <span className="block text-sm text-gray-400 pt-3 mt-4 border-t border-gray-200">
        가입일: {user.created_at.slice(0, 10)}
      </span>
    </div>
  );
}
