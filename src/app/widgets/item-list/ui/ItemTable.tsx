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
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { useState } from "react";
import ItemImage from "@/shared/ui/ItemImage";
import { formatDate } from "@/shared/lib/formatters";
import { copyToClipboard } from "@/shared/lib/copyToClipboard";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import CreateReportModal from "@/features/report/ui/CreateReportModal";
import { useUser } from "@/shared/hooks/useUser";

interface ItemTableProps {
  items: Item[];
  isLoading: boolean;
}

export const ItemTable = ({ items, isLoading }: ItemTableProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { data: user } = useUser();

  return (
    <div className="space-y-4">
      {isLoading ? (
        <>
          <LoadingSpinner />
          <p className="text-gray-500 mt-4 text-center text-sm">로딩중...</p>
        </>
      ) : (
        <Table className="min-w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <TableCaption className="sr-only">아이템 목록</TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-center font-medium text-sm text-gray-700">
                상품명
              </TableHead>
              <TableHead className="text-center font-medium text-sm text-gray-700">
                가격 (사이버머니)
              </TableHead>
              <TableHead className="text-center font-medium text-sm text-gray-700">
                판매상태
              </TableHead>
              <TableHead className="text-center font-medium text-sm text-gray-700">
                뽑기/상점/복권
              </TableHead>
              <TableHead className="text-center font-medium text-sm text-gray-700">
                판매자
              </TableHead>
              {/* <TableHead className="text-center font-medium text-sm text-gray-700">
              온라인
            </TableHead> */}
              <TableHead className="text-center font-medium text-sm text-gray-700">
                등록일
              </TableHead>
              {user && (
                <TableHead className="text-center font-medium text-sm text-gray-700">
                  신고
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item, idx) => (
              <Popover
                key={item.id}
                open={openIndex === idx}
                onOpenChange={(isOpen) => setOpenIndex(isOpen ? idx : null)}
              >
                <PopoverTrigger asChild>
                  <TableRow
                    className={`cursor-default ${
                      item.is_sold ? "opacity-40" : "opacity-100"
                    } ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors`}
                    onMouseEnter={() => setOpenIndex(idx)}
                    onMouseLeave={() => setOpenIndex(null)}
                  >
                    <TableCell className="text-center font-bold text-gray-800">
                      <div className="flex items-center gap-4 mx-auto w-[65%]">
                        <ItemImage
                          name={item.item_name}
                          imgUrl={item.image}
                          size="sm"
                        />
                        {item.item_name}({item.item_gender})
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-gray-700">
                      {item.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={`${
                          item.is_sold
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-600 text-white"
                        } px-2 py-1 rounded-full`}
                      >
                        {item.is_sold ? "판매완료" : "판매중"}
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
                        className="text-gray-700 truncate px-2 py-1 rounded cursor-pointer"
                        title={`디스코드 아이디: ${item.discord_id}`}
                        onClick={() =>
                          copyToClipboard(
                            item.discord_id,
                            "디스코드 아이디를 복사했습니다."
                          )
                        }
                      >
                        <div className="flex items-center font-medium text-gray-900">
                          {item.nickname}
                          <span className="flex items-center text-xs font-medium bg-gray-200 py-0 px-0.5 text-black rounded-md">
                            (
                            <span className="max-w-[36px] overflow-ellipsis overflow-hidden">
                              {item.discord_id}
                            </span>
                            )
                          </span>
                        </div>
                      </Badge>
                    </TableCell>
                    {/* <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className={`${
                        item.is_online
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      } px-2 py-1 rounded-full`}
                    >
                      {item.is_online ? "온라인" : "미접속"}
                    </Badge>
                  </TableCell> */}
                    <TableCell className="text-center text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </TableCell>
                    {user && (
                      <TableCell className="text-center text-sm text-gray-500">
                        <CreateReportModal />
                      </TableCell>
                    )}
                  </TableRow>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-4 shadow-lg rounded-lg bg-white"
                  side="right"
                  align="end"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ItemImage
                      name={item.item_name}
                      imgUrl={item.image}
                      size="lg"
                    />
                    <p className="text-center font-medium text-gray-900">
                      {item.item_name}
                    </p>
                    <p className="text-sm text-gray-500 max-w-[80px] break-words">
                      판매자: {item.nickname}({item.discord_id})
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </TableBody>
        </Table>
      )}

      {!isLoading && items.length === 0 && (
        <p className="text-center text-sm p-8 text-gray-500 pb-20">
          등록된 상품이 없습니다.
        </p>
      )}
    </div>
  );
};
