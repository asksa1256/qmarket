import z from "zod";
import { isContainProfanity } from "@/shared/lib/isContainProfanity";

export const bioFormSchema = z.object({
  bio: z
    .string()
    .max(200, "자기소개는 200자 이내로 입력해주세요.")
    .refine((val) => !isContainProfanity(val), "금지어가 포함되어 있습니다."),
});

export type BioFormType = z.infer<typeof bioFormSchema>;
