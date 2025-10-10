import { supabase } from "@/shared/api/supabase-client";

/**
 * 아이템 현재 판매가 시세 계산 함수
 * - 등록 10건 이상: 상하위 5% 트림 평균
 * - 등록 10건 미만: 중앙값(Median)
 */
export async function getItemMarketPrice(itemName: string, itemGender: string) {
  if (!itemName || itemName.trim().length === 0) {
    return { price: "0", count: 0 };
  }

  const TRIM_RATE = 0.05; // 상하위 5% (계산 제외)

  const { data: listings, error } = await supabase
    .from("items")
    .select("price")
    .eq("item_name", itemName)
    .eq("item_gender", itemGender)
    .order("price", { ascending: true }) // 최신순
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
  const count = prices.length;

  // 10건 이상 → 트림 평균
  if (count >= 10) {
    const trimCount = Math.floor(count * TRIM_RATE);
    const trimmed = prices.slice(trimCount, count - trimCount);
    const mean =
      trimmed.reduce((sum, val) => sum + val, 0) / (trimmed.length || 1);
    return { price: mean.toFixed(0), count: listings.length };
  }

  // 10건 미만 → 중앙값
  if (count % 2 === 1) {
    return {
      price: prices[Math.floor(count / 2)].toFixed(0),
      count: listings.length,
    };
  } else {
    const mid = count / 2;
    return {
      price: ((prices[mid - 1] + prices[mid]) / 2).toFixed(0),
      count: listings.length,
    };
  }
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

  const TRIM_RATE = 0.05;

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

  const prices = soldListings
    .map((item) => Number(item.price))
    .sort((a, b) => a - b);
  const count = prices.length;

  // 10건 이상 → 트림 평균
  if (count >= 10) {
    const trimCount = Math.floor(count * TRIM_RATE);
    const trimmed = prices.slice(trimCount, count - trimCount);
    const mean =
      trimmed.reduce((sum, val) => sum + val, 0) / (trimmed.length || 1);
    return { price: mean.toFixed(0), count: soldListings.length };
  }

  // 10건 미만 → 중앙값
  if (count % 2 === 1) {
    return {
      price: prices[Math.floor(count / 2)].toFixed(0),
      count: soldListings.length,
    };
  } else {
    const mid = count / 2;
    return {
      price: ((prices[mid - 1] + prices[mid]) / 2).toFixed(0),
      count: soldListings.length,
    };
  }
}
