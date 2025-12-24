import { useQuery } from "@tanstack/react-query";
import { getRemainingEntryCount } from "@/app/actions/best-dresser-actions";

export function useRemainingCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["remainingCount", userId],
    queryFn: async () => {
      const result = await getRemainingEntryCount();
      return result.remainingCount ?? 0;
    },
    enabled: !!userId,
  });
}
