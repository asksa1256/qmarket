import { supabase } from "@/shared/api/supabase-client";
import getMiddlePrice from "@/shared/lib/getMiddlePrice";

/**
 * 아이템 현재 판매가 시세 계산 함수
 */
export async function getItemMarketPrice(itemName: string, itemGender: string) {
  if (!itemName || itemName.trim().length === 0) {
    return { price: "0", count: 0 };
  }

  const { data: listings, error } = await supabase
    .from("items")
    .select("price")
    .eq("item_name", itemName)
    .eq("item_gender", itemGender)
    .order("price", { ascending: true }) // 최신순
    .eq("is_sold", false) // 판매중인 레코드만 선택
    .limit(50); // 최신순 상위 50개 조회 제한

  if (error) {
    console.error("아이템 목록 조회 중 오류:", error.message);
    throw new Error(error.message);
  }

  if (!listings || listings.length === 0) {
    return { price: "0", count: 0 };
  }

  const prices = listings
    .map((item) => Number(item.price))
    .sort((a, b) => a - b);
  const uniquePrices = [...new Set(prices)]; // 중복값 제거
  const price = getMiddlePrice(uniquePrices);

  return { price, count: listings.length };
}

/**
 * 아이템 거래 시세 계산 함수
 */
export async function getTradedMarketPrice(
  itemName: string,
  itemGender: string
) {
  if (!itemName || itemName.trim().length === 0) {
    return { price: "0", count: 0 };
  }

  const { data: soldListings, error } = await supabase
    .from("items")
    .select("price")
    .eq("item_name", itemName)
    .eq("item_gender", itemGender)
    .eq("is_sold", true) // 판매 완료된 레코드만 선택
    .order("updated_at", { ascending: false }) // 최신 거래 시점 기준 정렬
    .limit(50);

  if (error) {
    console.error("판매 완료 목록 조회 중 오류:", error.message);
    throw new Error(error.message);
  }

  if (!soldListings || soldListings.length === 0) {
    return { price: "0", count: 0 };
  }

  const prices = [
    ...new Set(soldListings.map((item) => Number(item.price))),
  ].sort((a, b) => a - b);
  const uniquePrices = [...new Set(prices)];
  const price = getMiddlePrice(uniquePrices);

  return { price, count: soldListings.length };
}
