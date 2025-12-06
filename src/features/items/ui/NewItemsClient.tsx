"use client";

import { Accordion } from "@/shared/ui/accordion";
import NewItemList from "./NewItemList";
import { ItemCardSmallProps } from "@/features/item/ui/ItemCardSmall";
import { FetchError } from "@/shared/config/types";

interface NewItemsClientProps {
  maleGatchaItems: {
    data: ItemCardSmallProps[];
    error: FetchError | null;
  };
  femaleGatchaItems: {
    data: ItemCardSmallProps[];
    error: FetchError | null;
  };
  maleMagicItems: {
    data: ItemCardSmallProps[];
    error: FetchError | null;
  };
  femaleMagicItems: {
    data: ItemCardSmallProps[];
    error: FetchError | null;
  };
}

export default function NewItemsClient({
  maleGatchaItems,
  femaleGatchaItems,
  maleMagicItems,
  femaleMagicItems,
}: NewItemsClientProps) {
  return (
    <Accordion type="multiple" className="space-y-8">
      <NewItemList
        title="뽑기(남)"
        items={maleGatchaItems.data}
        error={maleGatchaItems.error}
        value="male-gatcha"
      />
      <NewItemList
        title="뽑기(여)"
        items={femaleGatchaItems.data}
        error={femaleGatchaItems.error}
        value="female-gatcha"
      />
      <NewItemList
        title="요술상자(남)"
        items={maleMagicItems.data}
        error={maleMagicItems.error}
        value="male-magic"
      />
      <NewItemList
        title="요술상자(여)"
        items={femaleMagicItems.data}
        error={femaleMagicItems.error}
        value="female-magic"
      />
    </Accordion>
  );
}
