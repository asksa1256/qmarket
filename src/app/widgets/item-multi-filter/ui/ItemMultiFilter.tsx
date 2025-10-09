import ItemCategoryFilter from "@/features/item-search/ui/ItemCategoryFilter";

export default function ItemMultiFilter() {
  return (
    <div>
      {/* 아이템 카테고리 필터 */}
      <ItemCategoryFilter />

      {/* 검색창 */}
      {/* <div className="flex flex-1 justify-end">
          <SearchInput
            value={searchQuery}
            className="border border-gray-300 rounded-lg shadow-sm text-sm w-auto"
            onSearch={(e: string) => setSearchQuery(e)}
          />
        </div> */}

      {/* 정렬 버튼 */}
      {/* <Button
          variant="outline"
          onClick={() =>
            setSort((prev) =>
              prev === null
                ? "price_asc"
                : prev === "price_asc"
                ? "price_desc"
                : null
            )
          }
        >
          {!sort ? (
            <ClockArrowDown />
          ) : sort === "price_asc" ? (
            <ArrowDown01 />
          ) : (
            <ArrowDown10 />
          )}
          {!sort
            ? "최신순"
            : sort === "price_asc"
            ? "가격 낮은순"
            : "가격 높은순"}
        </Button> */}

      {/* 초기화 버튼 */}
      {/* <Button variant="outline" onClick={handleResetFilter}>
          <RefreshCcw />
          초기화
        </Button> */}
    </div>
  );
}
