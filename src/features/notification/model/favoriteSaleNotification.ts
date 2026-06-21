"use server";

import { supabaseServer } from "@/shared/api/supabase-server";
import { createNotifications } from "@/features/notification/model/notificationStore";

interface FavoriteSaleNotificationParams {
  itemId?: number;
  itemName: string;
  itemGender: string;
  sellerUserId: string;
}

interface FavoriteRow {
  user_id: string;
}

function getItemPath(itemName: string, itemGender: string) {
  return `/item/${encodeURIComponent(itemName)}/${encodeURIComponent(itemGender)}`;
}

function getItemGenderVariants(itemGender: string) {
  const normalizedGender = itemGender.trim().toLowerCase();

  if (normalizedGender === "w" || normalizedGender === "여") {
    return ["w", "여"];
  }

  if (normalizedGender === "m" || normalizedGender === "남") {
    return ["m", "남"];
  }

  return [itemGender];
}

export async function notifyFavoriteUsersForSaleItem({
  itemId,
  itemName,
  itemGender,
  sellerUserId,
}: FavoriteSaleNotificationParams) {
  const { data: favorites, error } = await supabaseServer
    .from("item_favorites")
    .select("user_id")
    .eq("item_name", itemName)
    .in("item_gender", getItemGenderVariants(itemGender))
    .neq("user_id", sellerUserId);

  if (error) {
    console.warn("찜 알림 대상 조회 실패:", error.message);
    return;
  }

  const favoriteRows = (favorites as FavoriteRow[] | null) ?? [];
  const favoriteUserIds = [...new Set(favoriteRows.map((row) => row.user_id))];

  if (favoriteUserIds.length === 0) {
    return;
  }

  const notifications = favoriteUserIds.map((userId) => ({
    user_id: userId,
    type: "favorite_item_listed",
    message: `찜해두신 ${itemName} 아이템이 매물로 등록되었습니다.`,
    link_url: getItemPath(itemName, itemGender),
    item_id: itemId ?? null,
    item_name: itemName,
    item_gender: itemGender,
  }));

  try {
    await createNotifications(notifications);
  } catch (error) {
    console.warn(
      "찜 판매 알림 저장 실패:",
      error instanceof Error ? error.message : error
    );
  }
}
