import SectionTitle from "@/shared/ui/SectionTitle";
import { supabaseServer } from "@/shared/api/supabase-server";
import { unstable_cache } from "next/cache";
import { Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui/tooltip";

const getItemRequests = unstable_cache(
  async () => {
    const { data, error } = await supabaseServer
      .from("item_reg_request")
      .select("id, item_name, item_gender, isRegistered")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("데이터 불러오기 실패:", error);
      return [];
    }

    return data || [];
  },
  ["item-reg-requests"],
  {
    tags: ["item-reg-requests"],
    revalidate: 86400, // 24시간 후 서버 동기화
  }
);

export default async function MyItemRequestSection() {
  const data = await getItemRequests();

  return (
    <section className="md:pl-8">
      <SectionTitle className="flex items-center gap-2">
        🔔 아이템 등록 요청 목록{" "}
        <Tooltip>
          <TooltipTrigger>
            <Info className="size-4 text-foreground/50" />
          </TooltipTrigger>
          <TooltipContent className="text-sm">
            검색되지 않는 아이템의 등록 요청 내역입니다. 등록 완료 시 목록에서
            사라집니다.
          </TooltipContent>
        </Tooltip>
      </SectionTitle>

      {data.length === 0 ? (
        <p className="text-foreground/50 text-sm">
          등록 요청하신 아이템이 없습니다.
        </p>
      ) : (
        <ul className="flex gap-2 flex-wrap">
          {data.map((d) => (
            <li
              key={d.id}
              className={`p-3 mb-2 border border-gray-300 rounded-lg w-auto ${
                d.isRegistered ? "bg-blue-50" : "bg-background"
              }`}
            >
              <strong>{d.item_name}</strong>
              <span className="text-foreground/60">({d.item_gender})</span>
              <span
                className={`ml-2 px-2 py-0.5 rounded text-xs text-white ${
                  d.isRegistered ? "bg-green-500" : "bg-amber-500"
                }`}
              >
                {d.isRegistered ? "등록완료" : "대기중"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
