import { Badge } from "@/shared/ui/badge";
import Image from "next/image";
import { Item } from "../model/types";
import MyItemActions from "@/widgets/my-item-actions/ui/MyItemActions";
import { cn } from "@/shared/lib/utils";

const ItemCard = ({ item }: { item: Item }) => {
  return (
    <div
      className={cn(
        "relative flex items-center md:items-start p-3 md:p-4 border rounded-lg shadow-sm w-full transition-all",
        {
          "opacity-50": item.is_sold,
        }
      )}
    >
      {/* 아이템 이미지 */}
      <figure className="mr-4 flex-shrink-0">
        <Image
          src={item.image ?? "/images/empty.png"}
          alt={item.item_name}
          width={100}
          height={122}
          className="md:w-[100px] w-[70px] h-auto object-cover overflow-hidden rounded-xl"
        />
      </figure>

      {/* 액션 버튼 (삭제/수정) */}
      <MyItemActions item={item} isSold={item.is_sold} />

      <div className="flex items-start self-start flex-1">
        {/* 아이템 정보 */}
        <div className="flex-grow min-w-0 flex flex-col gap-3 md:gap-4">
          <div className="mt-1 md:mt-2">
            <h3 className="text-base md:text-lg font-semibold truncate">
              {item.item_name}
              <span className="text-gray-500 text-xs md:text-sm">
                ({item.item_gender})
              </span>
            </h3>

            <p className="text-2xl md:text-3xl font-bold text-blue-700 flex items-center gap-0.5">
              {item.price.toLocaleString()}
              <span className="text-xs md:text-base mt-0.5">원</span>
            </p>
          </div>

          <div className="text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <Badge
                className={`${
                  item.is_sold ? "bg-black" : "bg-green-600"
                } text-white px-2 py-0.5 md:py-1`}
              >
                {item.is_sold ? "판매완료" : "판매중"}
              </Badge>

              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 border-yellow-200 px-2 py-0.5 md:py-1"
              >
                {item.item_source}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
