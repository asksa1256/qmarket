"use client";

import SellingItemCreateModal from "@/features/item/ui/SellingItemCreateModal";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";
import PurchaseItemCreateModal from "@/features/item/ui/PurchaseItemCreateModal";

export default function UserItemListHeader({ userId }: { userId: string }) {
  return (
    <div className="w-full mb-4 flex items-center justify-between">
      <ButtonToMain />

      <div className="mt-2 w-full text-right flex gap-2 justify-end">
        <SellingItemCreateModal />
        <PurchaseItemCreateModal />
      </div>
    </div>
  );
}
