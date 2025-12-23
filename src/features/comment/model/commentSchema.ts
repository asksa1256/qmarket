import { z } from "zod";

export const commentFormSchema = z.object({
  content: z
    .string()
    .min(2, "최소 2자 이상 입력해주세요.")
    .max(200, "200자 이내로 입력해주세요."),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;
