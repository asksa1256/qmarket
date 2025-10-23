import ItemRankingTable from "@/features/item-ranking/ui/ItemRankingTable";
import { supabase } from "@/shared/api/supabase-client";
import { useState, useEffect } from "react";
import { RankItem } from "@/entities/item/model/types";
import ItemMultiFilter from "@/widgets/item-multi-filter/ui/ItemMultiFilter";
import { ItemGenderKey } from "@/features/item-search/ui/ItemGenderFilter";

export default function ItemRankingView() {
  const [items, setItems] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<{
    category: string | null;
    gender: ItemGenderKey | null;
    isSold: boolean | null;
  }>({
    category: null,
    gender: null,
    isSold: null,
  });

  useEffect(() => {
    const fetchSoldItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("unique_ranked_items") // 생성한 View 이름 사용
          .select("*")
          .eq("is_sold", true)
          .order("price", { ascending: false })
          .limit(100);

        if (error) {
          throw error;
        }

        setItems(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSoldItems();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <>
      <h3 className="font-bold text-xl mb-4">시세 랭킹</h3>
      <ItemMultiFilter
        category={filters.category}
        gender={filters.gender}
        isSold={filters.isSold}
        onChange={setFilters}
        className="mb-4"
      />
      <ItemRankingTable items={items} />;
    </>
  );
}
