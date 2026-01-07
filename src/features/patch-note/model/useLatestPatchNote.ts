import { useQuery } from "@tanstack/react-query";
import { getLatestPatchNoteDate } from "@/app/actions/patch-note";

export function useLatestPatchNote() {
  return useQuery({
    queryKey: ["latestPatchNote"],
    queryFn: async () => {
      const latestDate = await getLatestPatchNoteDate();
      return latestDate;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24시간 (패치노트는 자주 변경되지 않음)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7일
  });
}
