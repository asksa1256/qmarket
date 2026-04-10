"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/shared/hooks/useUser";
import { useFavorites, useToggleFavorite, useFavoriteCount } from "@/shared/hooks/useFavorites";
import { useItemsInfoQuery } from "@/shared/hooks/useItemsInfoQuery";
import { cn } from "@/shared/lib/utils";

interface FavoriteButtonProps {
  itemInfoId?: string;
  itemName: string;
  itemImage: string | null;
  itemGender: string | null;
  size?: "sm" | "lg";
}

export default function FavoriteButton({
  itemInfoId,
  itemName,
  itemImage,
  itemGender,
  size = "sm",
}: FavoriteButtonProps) {
  const { data: user } = useUser();
  const { data: itemsInfo } = useItemsInfoQuery();

  const rawId =
    itemInfoId ??
    itemsInfo?.find((info) => info.name === itemName && info.item_gender === itemGender)?.id;
  const resolvedItemInfoId = rawId != null ? String(rawId) : undefined;

  const { data: favorites = [] } = useFavorites(user?.id);
  const toggleFavorite = useToggleFavorite(user?.id);
  const { data: countData } = useFavoriteCount(resolvedItemInfoId);

  const isFavorited = favorites.some((f) => f.item_info_id === resolvedItemInfoId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("찜 기능은 로그인 후 이용할 수 있습니다.");
      return;
    }

    if (!resolvedItemInfoId) {
      toast.error("아이템 정보를 찾을 수 없습니다.");
      return;
    }

    toggleFavorite.mutate({
      itemInfoId: resolvedItemInfoId,
      itemName,
      itemImage,
      itemGender,
      isFavorited,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggleFavorite.isPending}
      className="flex items-center gap-1 p-1 disabled:opacity-50"
      title={isFavorited ? "찜 취소" : "찜하기"}
    >
      <Heart
        className={cn(
          "transition-colors",
          size === "lg" ? "w-6 h-6" : "w-4 h-4",
          isFavorited
            ? "fill-red-500 text-red-500"
            : "text-gray-300 hover:text-red-400"
        )}
      />
      {countData !== undefined && countData.count > 0 && (
        <span className={cn(
          "text-foreground/50 leading-none",
          size === "lg" ? "text-sm" : "text-[10px]"
        )}>
          {countData.count}
        </span>
      )}
    </button>
  );
}
