"use client";

import ItemUpdateModal from "@/features/item/ui/ItemUpdateModal";
import { ItemDeleteModal } from "@/features/item/ui/ItemDeleteModal";
import { Item } from "@/features/item/model/itemTypes";
import { useUser } from "@/shared/hooks/useUser";

interface MyItemActionsProps {
  item: Item;
  isSold: boolean;
}

export default function MyItemActions({ item, isSold }: MyItemActionsProps) {
  const { data: user } = useUser();

  return (
    <div className="inline-flex gap-1">
      {!isSold && (
        <>
          <ItemUpdateModal item={item} />
          {user?.id && <ItemDeleteModal itemId={item.id} userId={user.id} />}
        </>
      )}
    </div>
  );
}
