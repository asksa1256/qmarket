import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";

export const useItemsQuery = () => {
  return useQuery({
    queryKey: ["items_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items_info")
        .select("id, name, image, item_gender, item_source, category");

      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
