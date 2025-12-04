"use client";

import Image from "next/image";
import { UserDetail } from "../model/userTypes";

export default function UserProfileCard({ user }: { user: UserDetail }) {
  return (
    <div className="text-center">
      <Image
        src={user.discord_profile_image ?? "images/empty.png"}
        alt={user.username}
        width={180}
        height={180}
        className="rounded-full border-4 border-blue-500 mb-5 mx-auto object-cover block"
      />

      <h4 className="font-bold text-foreground/80 mb-1">{user.username}</h4>

      <p className="text-base text-gray-600 mb-5 px-3 min-h-10">{user.bio}</p>

      <span className="block text-sm text-gray-400 pt-3 mt-4 border-t border-gray-200">
        가입일: {user.created_at.slice(0, 10)}
      </span>
    </div>
  );
}
