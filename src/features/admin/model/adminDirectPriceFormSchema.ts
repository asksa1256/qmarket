import z from "zod";

export const AdminDirectPriceFormSchema = z.object({
  item_name: z.string().min(1, "아이템명을 입력해주세요"),
  item_gender: z.string().min(1, "성별을 선택해주세요"),
  item_source: z.string().min(1, "출처를 선택해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  image: z.string().min(1, "이미지를 선택해주세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  created_at: z.string().min(1, "등록 일자를 입력해주세요"),
});

export type AdminDirectPriceValues = z.infer<typeof AdminDirectPriceFormSchema>;
