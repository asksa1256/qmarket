import ItemCardSmall from "@/features/item/ui/ItemCardSmall";
import { ItemCardSmallProps } from "@/features/item/ui/ItemCardSmall";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { FetchError } from "@/shared/config/types";

interface NewItemListProps {
  title: string;
  items: ItemCardSmallProps[];
  value: string;
  error: FetchError | null;
}

export default function NewItemList({
  title,
  items,
  value,
  error,
}: NewItemListProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="font-bold text-base md:text-lg">
        {title} {!error && items ? `(${items.length}개)` : ""}
      </AccordionTrigger>
      <AccordionContent>
        {error ? (
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
        ) : !items || items.length === 0 ? (
          <p className="text-foreground/50">
            이번 달 새로운 아이템이 없습니다.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <ItemCardSmall key={item.id} item={item} />
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
