import { useQuery } from "@tanstack/react-query";
import { SearchItemInfo } from "@/features/item/model/itemTypes";

export const useSearchItemQuery = (
  keyword: string,
  items: SearchItemInfo[]
) => {
  return useQuery({
    queryKey: ["items", "search", keyword],
    queryFn: () => {
      if (!keyword.trim()) return [];

      return items.filter((item) => {
        if (item.name === keyword) return true;

        const nameChars = item.name.split("");
        const inputChars = keyword.split("");

        return inputChars.every((c) => nameChars.includes(c));
      });
    },
    enabled: keyword.length > 0 && items.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
