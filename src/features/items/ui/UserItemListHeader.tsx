"use client";

import SellingItemCreateModal from "@/features/item/ui/SellingItemCreateModal";
import PurchaseItemCreateModal from "@/features/item/ui/PurchaseItemCreateModal";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";

export default function UserItemListHeader() {
  return (
    <div className="w-full mb-4 flex items-center justify-between">
      <ButtonToBack className="mb-0" />

      <div className="mt-2 w-full text-right flex gap-2 justify-end">
        <SellingItemCreateModal />
        <PurchaseItemCreateModal />
      </div>
    </div>
  );
}
