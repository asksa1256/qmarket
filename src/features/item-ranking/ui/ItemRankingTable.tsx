import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import ItemImage from "@/shared/ui/ItemImage";
import { formatDateYMD } from "@/shared/lib/formatters";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import CreateReportModal from "@/features/report/ui/CreateReportModal";
import { RankItem } from "@/features/item/model/itemTypes";
import { useUser } from "@/shared/hooks/useUser";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

interface ItemRankingTableProps {
  items: RankItem[];
  isLoading?: boolean;
}

export default function ItemRankingTable({
  items,
  isLoading,
}: ItemRankingTableProps) {
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
        <>
          {/* 데스크탑 뷰: 테이블 */}
          <div className="hidden md:block">
            <Table className="min-w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <TableCaption className="sr-only">아이템 목록</TableCaption>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-center font-medium text-sm text-gray-700">
                    순위
                  </TableHead>
                  <TableHead className="font-medium text-center text-sm text-gray-700">
                    아이템명
                  </TableHead>
                  <TableHead className="text-center font-medium text-sm text-gray-700">
                    가격 (사이버머니)
                  </TableHead>
                  <TableHead className="text-center font-medium text-sm text-gray-700">
                    최근 거래일자
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
                    key={`${item.item_name}-${item.item_gender}`}
                    open={openIndex === idx}
                    onOpenChange={(isOpen) => setOpenIndex(isOpen ? idx : null)}
                  >
                    <PopoverTrigger asChild>
                      <TableRow
                        className={`cursor-default ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition-colors`}
                        onMouseEnter={() => setOpenIndex(idx)}
                        onMouseLeave={() => setOpenIndex(null)}
                      >
                        <TableCell
                          className={cn(
                            "text-center text-gray-800",
                            item.rank < 11 && "font-bold text-[#2359B6]"
                          )}
                        >
                          {item.rank}
                        </TableCell>
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
                        <TableCell className="text-center text-sm text-gray-500">
                          {formatDateYMD(item.updated_at)}
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
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 모바일 뷰: 카드 */}
          <div className="md:hidden space-y-3">
            {items.map((item) => (
              <div
                key={`${item.item_name}-${item.item_gender}`}
                className="relative border rounded-lg p-3 shadow-sm bg-white"
              >
                <div className="flex items-center gap-3">
                  <ItemImage
                    name={item.item_name}
                    imgUrl={item.image}
                    size="sm"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {item.item_name}{" "}
                      <span className="text-xs text-gray-500">
                        ({item.item_gender})
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      💰{" "}
                      <b className="text-blue-600 font-bold text-xl">
                        {item.price.toLocaleString()}
                      </b>{" "}
                      사이버머니
                    </p>
                  </div>
                </div>

                <div className="mt-3 block md:grid md:grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-400 col-span-2">
                    - 거래일자: {formatDateYMD(item.updated_at)}
                  </span>
                </div>

                {user && (
                  <div className="absolute right-4 top-4">
                    <CreateReportModal />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoading && items.length === 0 && (
        <p className="text-center text-sm p-8 text-gray-500 pb-20">
          등록된 아이템이 없습니다.
        </p>
      )}
    </div>
  );
}
