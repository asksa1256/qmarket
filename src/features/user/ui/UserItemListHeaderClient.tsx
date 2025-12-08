"use client";

import { usePathname } from "next/navigation";
import UserItemListHeader from "./UserItemListHeader";
import { useUser } from "@/shared/hooks/useUser";
import { UserDetail } from "../model/userTypes";

export default function UserItemListHeaderClient({
  user,
}: {
  user: UserDetail;
}) {
  const pathname = usePathname();
  const { data: loginUser } = useUser();

  const isMyPage = pathname === "/my-items" && loginUser?.id === user.id;

  return isMyPage ? <UserItemListHeader /> : null;
}
