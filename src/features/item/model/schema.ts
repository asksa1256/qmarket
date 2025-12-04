import { z } from "zod";

export const ItemFormSchema = z.object({
  id: z.number().optional(),
  item_name: z.string().min(1, { message: "아이템명을 입력해주세요." }),
  price: z.number().min(1, { message: "가격을 입력해주세요." }),
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
    "board",
    "game",
  ]),
  image: z.string().nullable(),
  message: z.string().min(1, { message: "메시지를 입력해주세요." }),
});

export type ItemFormType = z.infer<typeof ItemFormSchema>;
