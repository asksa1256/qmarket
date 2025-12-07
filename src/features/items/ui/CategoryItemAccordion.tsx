"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/ui/accordion";
import { ItemSimple } from "@/features/item/ui/ItemBar";
import ItemBarList from "./ItemBarList";

interface CategoryItemAccordionProps {
  items: {
    male: ItemSimple[];
    female: ItemSimple[];
  };
}

export default function CategoryItemAccordion({
  items,
}: CategoryItemAccordionProps) {
  return (
    <Accordion type="multiple" className="flex md:flex-row flex-col md:gap-8">
      <AccordionItem value="male" className="border-none w-full md:w-[50%]">
        <AccordionTrigger className="font-semibold">
          남({items.male.length}개)
        </AccordionTrigger>
        <AccordionContent>
          <ItemBarList items={items.male} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="female" className="border-none w-full md:w-[50%]">
        <AccordionTrigger className="font-semibold">
          여({items.female.length}개)
        </AccordionTrigger>
        <AccordionContent>
          <ItemBarList items={items.female} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
