"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface FavoriteItem {
  id: number;
  item_info_id: string;
  item_name: string;
  item_image: string | null;
  item_gender: string | null;
  created_at: string;
}

export function useFavorites(userId: string | undefined | null) {
  return useQuery<FavoriteItem[]>({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const res = await fetch(`/api/favorites?userId=${userId}`);
      if (!res.ok) throw new Error("찜 목록 불러오기 실패");
      return res.json();
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
}

interface ToggleFavoriteArgs {
  itemInfoId: string;
  itemName: string;
  itemImage: string | null;
  itemGender: string | null;
  isFavorited: boolean;
}

export function useToggleFavorite(userId: string | undefined | null) {
  const queryClient = useQueryClient();
  const queryKey = ["favorites", userId];

  return useMutation({
    mutationFn: async ({ itemInfoId, itemName, itemImage, itemGender, isFavorited }: ToggleFavoriteArgs) => {
      if (isFavorited) {
        const res = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemInfoId }),
        });
        if (!res.ok) throw new Error("찜 삭제 실패");
        return res.json();
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemInfoId, itemName, itemImage, itemGender }),
        });
        if (!res.ok) throw new Error("찜 추가 실패");
        return res.json();
      }
    },
    onMutate: async ({ itemInfoId, itemName, itemImage, itemGender, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey });
      const countKey = ["favorite-count", itemInfoId];
      await queryClient.cancelQueries({ queryKey: countKey });

      const previousFavorites = queryClient.getQueryData<FavoriteItem[]>(queryKey);
      const previousCount = queryClient.getQueryData<{ count: number }>(countKey);

      queryClient.setQueryData<FavoriteItem[]>(queryKey, (old = []) => {
        if (isFavorited) {
          return old.filter((f) => f.item_info_id !== itemInfoId);
        } else {
          const optimisticItem: FavoriteItem = {
            id: Date.now(),
            item_info_id: itemInfoId,
            item_name: itemName,
            item_image: itemImage,
            item_gender: itemGender,
            created_at: new Date().toISOString(),
          };
          return [optimisticItem, ...old];
        }
      });

      queryClient.setQueryData<{ count: number }>(countKey, (old) => ({
        count: Math.max(0, (old?.count ?? 0) + (isFavorited ? -1 : 1)),
      }));

      return { previousFavorites, previousCount };
    },
    onSuccess: (_data, { itemInfoId }) => {
      // 서버 실제 데이터로 동기화 (타입 불일치 방지)
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["favorite-count", itemInfoId] });
    },
    onError: (_err, { itemInfoId }, context) => {
      if (context?.previousFavorites !== undefined) {
        queryClient.setQueryData(queryKey, context.previousFavorites);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(["favorite-count", itemInfoId], context.previousCount);
      }
    },
  });
}

export function useFavoriteCount(itemInfoId: string | undefined) {
  return useQuery<{ count: number }>({
    queryKey: ["favorite-count", itemInfoId],
    queryFn: async () => {
      const res = await fetch(`/api/favorites/count?itemInfoId=${itemInfoId}`);
      if (!res.ok) throw new Error("찜 수 조회 실패");
      return res.json();
    },
    enabled: !!itemInfoId,
    staleTime: 60 * 1000,
  });
}
