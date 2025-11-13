import { z } from "zod";

export const SignUpFormSchema = z
  .object({
    email: z
      .email("올바른 이메일 형식이 아닙니다.")
      .trim()
      .min(1, "이메일을 입력해주세요."),
    password: z.string().trim().min(8, "8자 이상 입력해주세요."),
    passwordChk: z.string().trim(),
    nickname: z.string().trim().min(2, "닉네임을 2글자 이상 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordChk, {
    path: ["passwordChk"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;
