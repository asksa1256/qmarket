import { z } from "zod";
import { isContainProfanity } from "@/shared/lib/isContainProfanity";
import { INQUIRY_CATEGORY } from "@/shared/config/constants";

export const InquiryFormSchema = z.object({
  inquiry_category: z.enum(INQUIRY_CATEGORY, {
    message: "카테고리를 선택해주세요",
  }),
  contact: z.email("유효한 이메일을 입력해주세요").or(z.literal("")),
  message: z
    .string()
    .min(1, { message: "메시지를 입력해주세요." })
    .refine((val) => !isContainProfanity(val), "금지어가 포함되어 있습니다."),
});

export type InquiryFormType = z.infer<typeof InquiryFormSchema>;
