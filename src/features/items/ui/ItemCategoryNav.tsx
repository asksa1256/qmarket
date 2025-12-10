import {
  ITEM_CATEGORY_NAV,
  ITEM_CATEGORY_MAP,
} from "@/shared/config/constants";
import Link from "next/link";
import ItemImage from "@/shared/ui/ItemImage";

export default function ItemCategoryNav() {
  return (
    <nav className="w-full">
      <ol className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 mx-auto">
        {ITEM_CATEGORY_NAV.map((n) => (
          <li key={n.key} className="group">
            <Link
              href={n.link}
              className="flex flex-col items-center justify-center w-full"
            >
              <ItemImage
                imgUrl={n.image}
                name={n.key}
                className="p-2 bg-gradient-to-b from-[#53A0DA] to-[#2359B6] border-1 border-[#002656] rounded-sm hover:from-[#2359B6]"
              />
              <span className="mt-2 text-sm font-medium text-foreground group-hover:underline group-hover:underline-offset-1 truncate">
                {ITEM_CATEGORY_MAP[n.key as keyof typeof ITEM_CATEGORY_MAP]}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
