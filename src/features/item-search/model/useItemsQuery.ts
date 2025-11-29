import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";

export const useItemsQuery = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items_info")
        .select("id, name, item_gender");

      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });
};
