"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Item } from "@/features/item/model/itemTypes";
import ItemForm from "./ItemForm";

interface ItemUpdateModalProps {
  item: Item;
}

export default function ItemUpdateModal({ item }: ItemUpdateModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="icon"
        className="gap-1.5 text-xs"
        aria-label="아이템 수정"
        title="아이템 수정"
        onClick={() => setOpen(true)}
      >
        <Pencil />
      </Button>

      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <DialogTitle>아이템 수정</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <ItemForm
          initialData={item}
          isForSale={item.is_for_sale}
          onSuccess={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
