"use server";

import { logSearchKeyword, getPopularSearches } from "@/shared/api/redis";
import { unstable_cache } from "next/cache";

export async function logSearchKeywordAction(
  keyword: string,
  itemGender: string
) {
  if (!keyword || !itemGender) return;
  try {
    await logSearchKeyword(keyword, itemGender);
  } catch (error) {
    console.error("Redis Log Error:", error);
  }
}

export const getPopularSearchesAction = unstable_cache(
  async () => {
    try {
      console.log("새로운 인기 검색어 데이터 가져오는 중...");
      return await getPopularSearches();
    } catch (error) {
      console.error("Redis Fetch Error:", error);
      return [];
    }
  },
  ["popular-searches-cache"], // 캐시 키 (조회용)
  {
    // revalidate: 3600, // 1시간 동안 캐시 유지
    revalidate: 10, // 테스트: 10초 동안 캐시 유지
    tags: ["popular-searches"], // 태그 (무효화용, revalidateTag)
  }
);
