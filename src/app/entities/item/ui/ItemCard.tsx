import { Badge } from "@/shared/ui/badge";
import Image from "next/image";
import { Item } from "../model/types";
import MyItemActions from "@/widgets/my-item-actions/ui/MyItemActions";
import { cn } from "@/shared/lib/utils";

const ItemCard = ({ item }: { item: Item }) => {
  return (
    <div
      className={cn("relative flex p-4 border rounded-lg shadow-sm", {
        "opacity-50": item.is_sold,
      })}
    >
      <figure className="overflow-hidden rounded-2xl mr-4">
        <Image
          src={item.image ?? "/images/empty.png"}
          alt={item.item_name}
          width={100}
          height={122}
        />
      </figure>

      <MyItemActions item={item} isSold={item.is_sold} />

      <div className="flex items-start self-start">
        {/* 아이템 정보 */}
        <div className="flex-grow min-w-0 flex flex-col gap-4">
          <div className="mt-2">
            <h3 className="text-lg font-semibold truncate">
              {item.item_name}({item.item_gender})
            </h3>
            <p className="text-3xl font-bold text-blue-700 flex items-center gap-0.5">
              {item.price.toLocaleString()}
              <span className="text-base mt-1">원</span>
            </p>
          </div>

          <div className="text-sm flex items-center justify-between">
            <div className="flex space-x-2 text-xs font-medium">
              {/* 판매 완료 여부 (is_sold) */}
              <Badge
                className={`${
                  item.is_sold ? "bg-black" : "bg-green-600"
                } text-white`}
              >
                {item.is_sold ? "판매완료" : "판매중"}
              </Badge>

              {/* 상품 출처 (is_gatcha) */}
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 border-yellow-200"
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
