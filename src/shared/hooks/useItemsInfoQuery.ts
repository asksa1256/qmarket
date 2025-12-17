import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";

// 검색 자동완성 쿼리 (클라이언트 컴포넌트에서 사용됨)
export const useItemsInfoQuery = () => {
  return useQuery({
    queryKey: ["items_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items_info")
        .select("id, name, image, item_gender, item_source, category");

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
