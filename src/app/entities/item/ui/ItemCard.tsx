import { Badge } from "@/shared/ui/badge";
import Image from "next/image";
import ItemEditModal from "@/features/item-upload-modal/ui/ItemEditModal";
import { Item } from "../model/types";

type ItemCardType = Omit<Item, "nickname">;

interface ItemCardProps {
  item: ItemCardType;
}

const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <div
      className={`relative flex p-4 border rounded-lg shadow-sm ${
        item.is_sold ? "opacity-50" : ""
      }`}
    >
      <figure className="overflow-hidden rounded-2xl mr-4">
        <Image
          src={item.image ?? "/images/empty.png"}
          alt={item.item_name}
          width={100}
          height={122}
        />
      </figure>

      <ItemEditModal item={item} />

      <div className="flex items-start space-x-4 self-start">
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

              {/* 판매자 온라인 여부 (is_online) */}
              <Badge
                variant="secondary"
                className={
                  item.is_online ? "bg-blue-500 text-white" : undefined
                }
              >
                {item.is_online ? "온라인" : "미접속"}
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
