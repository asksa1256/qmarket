import { Badge } from "@/shared/ui/badge";
import Image from "next/image";
import { Item } from "../../../features/item/model/itemTypes";
import MyItemActions from "@/features/item/ui/MyItemActions";
import { cn } from "@/shared/lib/utils";
import SoldButton from "@/features/item/ui/SoldButton";

interface ItemCardProps {
  item: Item;
  userId: string;
}

const ItemCard = ({ item, userId }: ItemCardProps) => {
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
      <figure className="flex-shrink-0">
        <Image
          src={item.image ?? "/images/empty.png"}
          alt={item.item_name}
          width={60}
          height={60}
          className="w-[60px] h-[60px] object-cover rounded-md"
        />
      </figure>

      {/* 아이템 정보 */}
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium truncate">
            {item.item_name}
            <span className="ml-1 text-gray-500 text-xs">
              ({item.item_gender})
            </span>
            {item.item_source && (
              <Badge
                variant="outline"
                className="text-[10px] bg-yellow-100 text-yellow-800 border-yellow-200 px-1.5 py-0"
              >
                {item.item_source}
              </Badge>
            )}
          </h3>

          <h4 className="text-base font-semibold text-blue-700 flex items-center gap-0.5">
            {item.price.toLocaleString()}
            <span className="text-[10px] mt-0.5">원</span>
          </h4>
        </div>

        <div className="flex items-center justify-between mt-1 gap-1">
          {item.is_for_sale && !item.is_sold && (
            <SoldButton itemId={item.id} userId={userId} />
          )}

          {/* 액션 버튼 (수정/삭제) */}
          <MyItemActions item={item} isSold={item.is_sold} />
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
