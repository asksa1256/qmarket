import { Item } from "@/entities/item/model/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";

interface ItemListWidgetProps {
  items: Item[];
  isLoading: boolean;
}

export const ItemListWidget = ({ items, isLoading }: ItemListWidgetProps) => {
  return (
    <div className="space-y-4">
      <Table>
        <TableCaption className="sr-only">아이템 목록</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">상품명</TableHead>
            <TableHead className="text-center font-bold">가격</TableHead>
            <TableHead className="text-center font-bold">판매 상태</TableHead>
            <TableHead className="text-center font-bold">온라인</TableHead>
            <TableHead className="text-center font-bold">출처</TableHead>
            <TableHead className="text-center font-bold">판매자</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className={item.is_sold ? "opacity-30" : undefined}
            >
              <TableCell className="text-center">{item.item_name}</TableCell>
              <TableCell className="text-center">{item.price}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={
                    item.is_sold ? undefined : "bg-blue-600 text-white"
                  }
                >
                  {item.is_sold ? "판매완료" : "판매중"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={
                    item.is_online ? "bg-green-600 text-white" : undefined
                  }
                >
                  {item.is_online ? "온라인" : "미접속"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                  {item.item_source}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary" className="text-gray-700 truncate">
                  <span className="font-medium text-gray-900">
                    {item.nickname}
                  </span>
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isLoading && (
        <p className="text-center p-8">상품 목록을 불러오는 중입니다...</p>
      )}

      {!isLoading && items.length === 0 && (
        <p className="text-center p-8 text-gray-500">등록된 상품이 없습니다.</p>
      )}
    </div>
  );
};
