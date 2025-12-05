"use client";

import { Badge } from "@/shared/ui/badge";
import Image from "next/image";
import { Item } from "@/features/item/model/itemTypes";
import MyItemActions from "@/features/item/ui/MyItemActions";
import { cn } from "@/shared/lib/utils";
import SoldButton from "@/features/item/ui/SoldButton";
import { usePathname } from "next/navigation";
import { useUser } from "@/shared/hooks/useUser";
import Link from "next/link";
import { formatDateYMD } from "@/shared/lib/formatters";
import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

interface ItemCardProps {
  item: Item;
  userId?: string;
}

const ItemCard = ({ item, userId }: ItemCardProps) => {
  const pathname = usePathname();
  const { data: user } = useUser();
  const encodedItemName = encodeURIComponent(item.item_name);
  const encodedItemGender = encodeURIComponent(item.item_gender);

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-3 py-2 border-b border-gray-100 w-full hover:bg-gray-50 transition-colors",
        {
          "opacity-60": item.is_sold,
        }
      )}
    >
      {/* 아이템 이미지 */}
      <Link
        href={`/item/${encodedItemName}/${encodedItemGender}`}
        className="shrink-0"
      >
        <Image
          src={item.image || "/images/empty.png"}
          alt={item.item_name}
          width={60}
          height={60}
          className="w-[60px] h-[68px] object-cover rounded-sm"
        />
      </Link>

      {/* 아이템 정보 */}
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium truncate">
            <Link href={`/item/${encodedItemName}/${encodedItemGender}`}>
              {item.item_name}
              <span className="text-gray-500 text-xs">
                ({item.item_gender})
              </span>
              {item.item_source && (
                <Badge
                  variant="outline"
                  className="ml-1 text-[10px] bg-yellow-100 text-yellow-800 border-yellow-200 px-1.5 py-0"
                >
                  {item.item_source}
                </Badge>
              )}
            </Link>
          </h3>

          <h4 className="text-base font-semibold text-blue-700 flex items-center">
            {item.price.toLocaleString()}
            <span className="text-[10px] mt-0.5">원</span>
          </h4>

          {item.message && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="bg-secondary text-foreground font-medium text-xs rounded-sm px-1.5 py-0.5 w-[120px] truncate">
                  {item.message}
                </p>
              </TooltipTrigger>
              <TooltipContent>{item.message}</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* 아이템 등록 유저 정보 */}
        <div className="flex flex-col items-end gap-1 text-xs mt-1">
          {!pathname.includes("my-items") && !pathname.includes("user") && (
            <>
              <Link
                href={`/user/${item.user_id}`}
                className="flex font-medium group hover:text-blue-600 hover:underline underline-offset-2"
              >
                {item.nickname}(
                {item.discord_id.length > 8
                  ? `${item.discord_id.slice(0, 8)}...`
                  : item.discord_id}
                )
                <ExternalLink className="mt-0.5 shrink-0 size-3 text-foreground/70 inline-block ml-0.5 group-hover:text-blue-600" />
              </Link>
            </>
          )}

          <span className="text-foreground/50">
            등록일: {formatDateYMD(item.created_at)}
          </span>

          {/* 마이 페이지 actions */}
          {pathname.includes("my-items") && (
            <div className="flex items-center mt-1 gap-1 self-start">
              {/* 판매/구매 완료 버튼 */}
              {!item.is_sold && userId && (
                <SoldButton
                  itemId={item.id}
                  userId={userId}
                  isForSale={item.is_for_sale}
                />
              )}

              {/* 액션 버튼 (수정/삭제) */}
              {user?.id === userId && (
                <MyItemActions item={item} isSold={item.is_sold} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
