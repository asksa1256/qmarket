import { useInfiniteQuery } from "@tanstack/react-query";
import { Item } from "@/entities/item/model/types";

const fetchClientItems = async (
  limit: number,
  offset: number
): Promise<Item[]> => {
  const res = await fetch(`/api/items?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("상품 데이터를 불러오지 못했습니다.");
  return res.json();
};

export function useInfiniteItems(initialItems: Item[]) {
  return useInfiniteQuery({
    queryKey: ["items"],
    queryFn: ({ pageParam = 0 }) => fetchClientItems(10, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length * 10 : undefined,
    initialData: {
      pages: [initialItems],
      pageParams: [0],
    },
    initialPageParam: 0,
  });
}
