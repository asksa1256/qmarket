export const dynamic = "force-static";

import { supabase } from "@/shared/api/supabase-client";
import { BestDresserEntry } from "./bestDresserType";

export const getBestDressers = async (): Promise<BestDresserEntry[]> => {
  const { data, error } = await supabase
    .from("best_dresser")
    .select("*")
    .order("votes", { ascending: false })
    .limit(3);

  if (error) {
    console.error(error);
    throw new Error("베스트 드레서 불러오기 실패");
  }

  return data;
};
