"use client";

import Image from "next/image";
import { UserDetail } from "../model/userTypes";
import UserBioForm from "./UserBioForm";
import { copyToClipboard } from "@/shared/lib/copyToClipboard";
import { Button } from "@/shared/ui/button";

export default function UserProfileCard({ user }: { user: UserDetail }) {
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

      <span className="block text-sm text-gray-400 pt-3 mt-4 border-t border-gray-200">
        가입일: {user.created_at.slice(0, 10)}
      </span>
    </div>
  );
}
