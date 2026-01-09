import { z } from "zod";

export const DirectPriceCreateFormSchema = z.object({
  id: z.number().optional(),
  item_name: z.string().min(1, { message: "아이템명을 입력해주세요." }),
  item_gender: z.enum(["w", "m"]),
  item_source: z.enum(["gatcha", "shop", "lottery", "magic"]),
  image: z.string().nullable(),
  category: z.enum([
    "face",
    "hair",
    "clothes",
    "mouth",
    "eye",
    "ear",
    "pet",
    "acc",
    "bg",
    "slime",
    "board",
    "game",
  ]),
  price: z.number().min(1, { message: "가격을 입력해주세요." }),
  transaction_image: z.string().min(1, "거래 인증 이미지를 등록해주세요."),
  isForSale: z.boolean(),
  message: z.string().optional(),
});

export type DirectPriceCreateFormType = z.infer<
  typeof DirectPriceCreateFormSchema
>;
