import { supabase } from "@/shared/api/supabase-client";
import { ITEMS_TABLE_NAME } from "@/shared/config/constants";
import { ITEM_CATEGORY_MAP } from "@/shared/config/constants";
import { ItemCategory, ItemGender } from "@/features/item/model/itemTypes";

interface getFilteredItemsProps {
  itemName?: string;
  itemGender?: ItemGender;
  category?: ItemCategory;
  isForSale?: boolean;
  isSold?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "created_at" | "price";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

const getFilteredItems = async ({
  itemName,
  itemGender,
  category,
  isForSale,
  isSold,
  minPrice,
  maxPrice,
  sortBy = "created_at",
  sortOrder = "desc",
  limit,
}: getFilteredItemsProps) => {
  let query = supabase
    .from(ITEMS_TABLE_NAME)
    // .from("items_test")
    .select("*")
    .not("user_id", "is", null);

  if (itemName) {
    query = query.eq("item_name", itemName);
  }
  if (itemGender) {
    query = query.eq("item_gender", itemGender);
  }
  if (category) {
    query = query.eq("category", ITEM_CATEGORY_MAP[category]);
  }
  if (isForSale !== undefined) {
    query = query.eq("is_for_sale", isForSale);
  }
  if (isSold !== undefined) {
    query = query.eq("is_sold", isSold);
  }
  if (limit !== undefined) {
    query = query.limit(limit);
  }

  // 가격 필터
  if (minPrice !== undefined) {
    query = query.gte("price", minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte("price", maxPrice);
  }

  // 정렬
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  const { data, error } = await query.order("created_at", { ascending: false });

  if (data) {
    return data.map((item) => ({
      ...item,
      image: item.image ? item.image.trim() : null,
    }));
  }

  if (error) {
    console.error("아이템 목록 로딩 오류:", error);
    throw new Error(error.message);
  }
  return data;
};

export default getFilteredItems;
