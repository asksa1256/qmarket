import { ITEM_CATEGORY_NAV } from "@/shared/config/constants";
import Image from "next/image";
import Link from "next/link";

export default function ItemCategoryNav() {
  return (
    <ol className="grid grid-cols-3 md:grid-cols-6 gap-2 mx-auto">
      {ITEM_CATEGORY_NAV.map((n) => (
        <li
          key={n.key}
          className="p-2 bg-gradient-to-b from-[#51a0da] to-[#2256b2] rounded-md hover:from-[#2256b2] hover:to-[#51a0da] hover:shadow-md"
        >
          <Link href={n.link}>
            <Image src={n.image} alt={n.key} width={86} height={95} />
          </Link>
        </li>
      ))}
    </ol>
  );
}
