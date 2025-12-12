import { supabase } from "@/shared/api/supabase-client";

interface UserTransactionCounts {
  is_sold_count: number;
  transaction_images_count: number;
}

export const getTransactionsCount = async (userId: string) => {
  const { data, error } = await supabase
    .rpc("get_user_transaction_counts", { target_user_id: userId })
    .single();

  if (error) {
    throw new Error("거래 완료 데이터 가져오기에 실패했습니다.");
  }

  const returnData = data as UserTransactionCounts;

  return {
    isSoldCount: returnData.is_sold_count,
    transactionImagesCount: returnData.transaction_images_count,
  };
};
