import ItemImage from "@/shared/ui/ItemImage";
import Link from "next/link";

export interface ItemCardSmallProps {
  id?: number;
  name: string;
  item_gender: string;
  image: string | null;
}

export default function ItemCardSmall({ item }: { item: ItemCardSmallProps }) {
  return (
    <div className="inline-flex gap-4 p-2 bg-gradient-to-b from-[#53A0DA] to-[#2359B6] border-1 border-[#002656] rounded-sm">
      <Link href={`/item/${item.name}/${item.item_gender}`}>
        <ItemImage
          name={item.name}
          imgUrl={item.image || "/images/empty.png"}
          size="lg"
          className="border-1 border-[#002656] rounded-none w-[80px] h-[86px] [&_img]:w-full [&_img]:h-auto"
        />
        <div className="flex flex-col gap-2">
          <h4 className="text-white mt-1 text-sm">{item.name}</h4>
        </div>
      </Link>
    </div>
  );
}
