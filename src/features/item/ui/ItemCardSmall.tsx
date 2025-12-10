import ItemImage from "@/shared/ui/ItemImage";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FilterCategoryKey } from "@/features/items/ui/NewItemList";

export interface ItemCardSmallProps {
  id?: number;
  name: string;
  item_gender: string;
  image: string | null;
  category: FilterCategoryKey;
}

export default function ItemCardSmall({ item }: { item: ItemCardSmallProps }) {
  return (
    <div className="group inline-flex gap-4 p-2 bg-gradient-to-b from-[#53A0DA] to-[#2359B6] border-1 border-[#002656] rounded-sm hover:from-[#2359B6]">
      <Link href={`/item/${item.name}/${item.item_gender}`}>
        <ItemImage
          name={item.name}
          imgUrl={item.image || "/images/empty.png"}
          size="lg"
          className="border-1 border-[#002656] rounded-none w-[80px] h-[90px] [&_img]:w-full [&_img]:h-auto"
        />
        <div className="flex flex-col mt-1">
          <h4 className="text-sm text-center text-white">{item.name}</h4>
          <span className="flex items-center justify-center gap-1 text-xs text-gray-300 group-hover:underline group-hover:underline-offset-1">
            상세보기
            <ExternalLink className="size-3" />
          </span>
        </div>
      </Link>
    </div>
  );
}
