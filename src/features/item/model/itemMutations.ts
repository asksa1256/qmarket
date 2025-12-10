import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemFormType } from "./schema";
import { createItem, updateItem } from "@/app/actions/item-actions";
import {
  ITEM_SOURCES_MAP,
  ITEM_GENDER_MAP,
  ITEM_CATEGORY_MAP,
} from "@/shared/config/constants";
import { toast } from "sonner";
import { useUser } from "@/shared/hooks/useUser";
import { getDailyItemCountAction } from "@/app/actions/item-actions";

interface UseCreateItemMutationProps {
  isForSale: boolean;
  onSuccessCallback?: () => void;
}

export const useCreateItemMutation = (props: UseCreateItemMutationProps) => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ItemFormType) => {
      if (!user) throw new Error("로그인이 필요합니다.");

      const { remaining } = await getDailyItemCountAction();
      if (remaining <= 0) {
        throw new Error(
          "일일 등록 횟수를 모두 사용했습니다. 내일 다시 시도해주세요."
        );
      }

      return createItem({
        item_name: values.item_name,
        price: values.price,
        image: values.image,
        is_sold: false,
        is_for_sale: props.isForSale,
        item_source: ITEM_SOURCES_MAP[values.item_source],
        nickname: user?.user_metadata.custom_claims.global_name,
        discord_id: user?.user_metadata.full_name,
        item_gender: ITEM_GENDER_MAP[values.item_gender],
        user_id: user?.id,
        category: ITEM_CATEGORY_MAP[values.category],
        message: values.message || "",
      });
    },
    onSuccess: async () => {
      toast.success(
        props.isForSale
          ? "판매 아이템을 등록했습니다."
          : "아이템 구매 요청을 등록했습니다."
      );

      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["my-items", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["filtered-items"] });
      queryClient.refetchQueries({ queryKey: ["filtered-items"] }); // 해당 쿼리 키는 자동 refetch 옵션이 꺼져있으므로, 아이템 등록 후 강제 refetch (요청 최적화를 위해 자동 refetch 옵션 해제 상태)
      queryClient.invalidateQueries({
        queryKey: ["item-create-limit-count", user?.id],
      });

      props?.onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });
};

interface UpdateItemMutationParams {
  id?: number;
  data: ItemFormType;
}

interface UseUpdateItemMutationProps {
  onSuccessCallback?: () => void;
  isForSale: boolean;
}

export const useUpdateItemMutation = (props: UseUpdateItemMutationProps) => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data: values }: UpdateItemMutationParams) => {
      if (!user) throw new Error("로그인이 필요합니다.");

      return updateItem({
        id,
        item_name: values.item_name,
        price: values.price,
        image: values.image,
        is_sold: false,
        is_for_sale: props.isForSale,
        item_source: ITEM_SOURCES_MAP[values.item_source],
        nickname: user?.user_metadata.custom_claims.global_name,
        discord_id: user?.user_metadata.full_name,
        item_gender: ITEM_GENDER_MAP[values.item_gender],
        user_id: user?.id,
        category: ITEM_CATEGORY_MAP[values.category],
        message: values.message || "",
      });
    },
    onSuccess: async () => {
      toast.success("아이템이 수정되었습니다.");

      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["my-items", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["filtered-items"] });
      queryClient.refetchQueries({ queryKey: ["filtered-items"] });

      props?.onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });
};
