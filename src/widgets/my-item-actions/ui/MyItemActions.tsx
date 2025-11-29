"use client";

import ItemUpdateModal from "@/features/item-upload-modal/ui/ItemUpdateModal";
import { ItemDeleteModal } from "@/features/item-upload-modal/ui/ItemDeleteModal";
import { Item } from "@/entities/item/model/types";
import { useUser } from "@/shared/hooks/useUser";

interface MyItemActionsProps {
  item: Item;
  isSold: boolean;
}

export default function MyItemActions({ item, isSold }: MyItemActionsProps) {
  const { data: user } = useUser();

  return (
    <div className="flex gap-1">
      {!isSold && (
        <>
          <ItemUpdateModal item={item} />
          {user?.id && <ItemDeleteModal itemId={item.id} userId={user.id} />}
        </>
      )}
    </div>
  );
}
