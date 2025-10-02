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
      <Table className="min-w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <TableCaption className="sr-only">아이템 목록</TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-center font-semibold text-gray-700">
              상품명
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700">
              가격
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700">
              판매상태
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700">
              온라인
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700">
              뽑기/상점/복권
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700">
              판매자
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.id}
              className={`${item.is_sold ? "opacity-40" : "opacity-100"} ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition-colors`}
            >
              <TableCell className="text-center font-medium text-gray-800">
                {item.item_name}
              </TableCell>
              <TableCell className="text-center text-gray-700">
                {item.price.toLocaleString()}원
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={`${
                    item.is_sold
                      ? "bg-red-100 text-red-700"
                      : "bg-green-600 text-white"
                  } px-2 py-1 rounded-full`}
                >
                  {item.is_sold ? "판매완료" : "판매중"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={`${
                    item.is_online
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  } px-2 py-1 rounded-full`}
                >
                  {item.is_online ? "온라인" : "미접속"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-200 px-2 py-1 rounded-full"
                >
                  {item.item_source}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="text-gray-700 truncate px-2 py-1 rounded"
                  title={item.nickname} // hover 시 전체 이름 표시
                >
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
        <p className="text-center text-sm p-8">
          상품 목록을 불러오는 중입니다...
        </p>
      )}

      {!isLoading && items.length === 0 && (
        <p className="text-center text-sm p-8 text-gray-500">
          등록된 상품이 없습니다.
        </p>
      )}
    </div>
  );
};
