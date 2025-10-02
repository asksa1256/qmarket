import { useInfiniteQuery } from "@tanstack/react-query";
import { Item } from "@/entities/item/model/types";

const fetchClientItems = async (
  limit: number,
  offset: number,
  search?: string,
  sort?: "price_asc" | "price_desc" | null
): Promise<Item[]> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search: search || "", // undefined 대신 빈 문자열
  });

  if (sort) {
    params.set("sort", sort);
  }

  const res = await fetch(`/api/items?${params.toString()}`);
  if (!res.ok) throw new Error("상품 데이터를 불러오지 못했습니다.");
  return res.json();
};

export function useInfiniteItems(
  initialItems: Item[],
  search: string,
  sort: "price_asc" | "price_desc" | null
) {
  return useInfiniteQuery({
    queryKey: ["items", search, sort],
    queryFn: ({ pageParam = 0 }) =>
      fetchClientItems(10, pageParam, search, sort),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length * 10 : undefined,
    initialData: {
      pages: [initialItems],
      pageParams: [0],
    },
    initialPageParam: 0,
  });
}
