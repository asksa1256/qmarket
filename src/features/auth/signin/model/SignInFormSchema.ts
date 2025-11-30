import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z
    .email("올바른 이메일 형식이 아닙니다.")
    .trim()
    .min(1, "이메일을 입력해주세요."),
  password: z.string().min(8, "8자 이상 입력해주세요."),
});

export type SignInFormValues = z.infer<typeof SignInFormSchema>;
