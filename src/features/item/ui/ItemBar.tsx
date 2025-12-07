import Image from "next/image";
import Link from "next/link";

export interface ItemSimple {
  id: number;
  name: string;
  image: string | null;
  item_gender: string;
}

interface ItemBarProps {
  item: ItemSimple;
}

export default function ItemBar({ item }: ItemBarProps) {
  return (
    <div className="text-xs p-2 bg-gray-100 rounded-sm">
      <Link
        href={`/item/${item.name}/${item.item_gender}`}
        className="group flex gap-3 items-center"
      >
        <div className="w-10 h-12 relative shrink-0">
          <Image
            src={item.image || "/images/empty.png"}
            alt=""
            fill
            className="object-contain w-full h-full"
          />
        </div>
        <span className="group-hover:underline group-hover:underline-offset-1">
          {item.name}
        </span>
      </Link>
    </div>
  );
}
