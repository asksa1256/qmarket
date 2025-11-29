import { z } from "zod";

export const ItemFormSchema = z.object({
  item_name: z.string().min(1, { message: "상품명을 입력해주세요." }),
  price: z.number().min(0, { message: "가격은 0 이상이어야 합니다." }),
  is_sold: z.boolean(),
  item_source: z.enum(["gatcha", "shop", "lottery", "magic"]),
  item_gender: z.enum(["w", "m"]),
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
    "qmon",
    "board",
    "game",
  ]),
  image: z.string().nullable(),
  message: z.string().optional(),
});

export type ItemFormValues = z.infer<typeof ItemFormSchema>;

export const PurchaseItemUpdateFormSchema = z.object({
  item_name: z.string().min(1, { message: "상품명을 입력해주세요." }),
  price: z.number().min(0, { message: "가격은 0 이상이어야 합니다." }),
  item_source: z.enum(["gatcha", "shop", "lottery", "magic"]),
  item_gender: z.enum(["w", "m"]),
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
    "qmon",
    "board",
    "game",
  ]),
  image: z.string().nullable(),
  message: z.string().optional(),
});

export type PurchaseItemUpdateFormType = z.infer<
  typeof PurchaseItemUpdateFormSchema
>;
