import z from "zod";

export const reportFormSchema = z
  .object({
    report_category: z.string({
      message: "카테고리를 선택해주세요.",
    }),
    item_name: z.string().optional(),
    user_id: z.string().optional(),
    details: z.string().min(1, "내용을 작성해주세요.").trim(),
  })
  .refine((data) => data.item_name || data.user_id, {
    message: "신고 대상 아이템명 또는 유저 아이디를 입력해주세요.",
    path: ["item_name"],
  });

export type ReportFormData = z.infer<typeof reportFormSchema>;
