export const dynamic = "force-static";

import { supabase } from "@/shared/api/supabase-client";
import { BestDresserRanked } from "./bestDresserType";
import { applyBestDresserRank } from "./applyBestDresserRank";

export const getBestDressers = async (): Promise<BestDresserRanked[]> => {
  const { data, error } = await supabase
    .from("best_dresser")
    .select("*")
    .order("votes", { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    throw new Error("베스트 드레서 불러오기 실패");
  }

  return applyBestDresserRank(data);
};
