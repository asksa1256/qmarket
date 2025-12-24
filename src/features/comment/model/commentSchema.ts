import { z } from "zod";

export const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, "내용을 입력해주세요.")
    .max(200, "200자 이내로 입력해주세요."),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;
