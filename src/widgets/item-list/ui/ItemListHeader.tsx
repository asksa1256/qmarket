import { useState, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ItemCard from "@/entities/item/ui/ItemCard";
import { Item } from "@/entities/item/model/types";
import { supabase } from "@/shared/api/supabase-client";
import ItemUploadModal from "@/features/item-upload-modal/ui/ItemUploadModal";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";
import SearchInput from "@/features/item-search/ui/SearchInput";
import {
  ITEMS_TABLE_NAME,
  SELECT_ITEM_COLUMNS,
} from "@/shared/config/constants";
import { getDailyItemCountAction } from "@/features/item-upload-modal/model/actions";
import { DAILY_LIMIT } from "@/shared/lib/redis";
import DailyLimitDisplay from "@/features/item-upload-modal/ui/DailyLimitDisplay";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import ItemSoldFilter from "@/features/item-search/ui/ItemSoldFilter";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

const ItemListHeader = () => {
  return (
    <>
      <div className="flex flex-wrap md:flex-row gap-4 md:gap-0 w-full mb-4 justify-between">
        <ButtonToMain />

        <div className="flex flex-wrap md:flex-row justify-end md:justify-start gap-2 w-full md:w-auto">
          <div className="md:mb-4">
            <ItemSoldFilter value={soldFilter} onChange={setSoldFilter} />
          </div>

          <div className="w-full text-right md:w-auto md:text-left">
            <SearchInput
              value={searchQuery}
              className="border border-gray-300 rounded-lg shadow-sm text-sm w-auto"
              onSearch={(value: string) => setSearchQuery(value)}
            />
          </div>
        </div>
        <div className="w-full text-right">
          <ItemUploadModal
            onSuccess={() => {
              refetchLimitInfo();
              refetch();
            }}
          />
        </div>
      </div>

      {/* 아이템 등록 가능 횟수 */}
      <div className="flex justify-end mb-4">
        <DailyLimitDisplay remaining={limitStatus.remaining} />
      </div>

      <div className="rounded-xl border p-4 mt-4">
        <p className="text-gray-500 text-sm">
          * <b>판매완료</b> 처리는 <b>아이템 수정</b>을 이용해주세요.
        </p>
      </div>
    </>
  );
};

export default ItemListHeader;
