import ItemBar from "@/features/item/ui/ItemBar";
import { ItemSimple } from "@/features/item/ui/ItemBar";

export default function ItemBarList({ items }: { items: ItemSimple[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <ItemBar key={item.id} item={item} />
      ))}
    </div>
  );
}
