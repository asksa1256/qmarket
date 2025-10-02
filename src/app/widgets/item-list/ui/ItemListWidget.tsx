import ItemRow from "@/entities/item/ui/ItemRow";
import { Item } from "@/entities/item/model/types";

interface ItemListWidgetProps {
  items: Item[];
  isLoading: boolean;
}

export const ItemListWidget = ({ items, isLoading }: ItemListWidgetProps) => {
  return (
    <div className="space-y-4">
      {isLoading && (
        <p className="text-center p-8">상품 목록을 불러오는 중입니다...</p>
      )}
      {!isLoading && items.length === 0 && (
        <p className="text-center p-8 text-gray-500">등록된 상품이 없습니다.</p>
      )}
      {items.map((item) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </div>
  );
};
