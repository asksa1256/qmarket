import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/shared/ui/textarea";
import { ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/shared/api/supabase-client";
import { Input } from "@/shared/ui/input";
import { MailQuestionMark } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InquiryFormSchema, InquiryFormType } from "../model/inquirySchema";
import { INQUIRY_CATEGORY } from "@/shared/config/constants";

const CreateInquiryModal = ({ trigger }: { trigger?: ReactNode }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors, isValid },
    control,
  } = useForm({
    resolver: zodResolver(InquiryFormSchema),
    defaultValues: {
      inquiry_category: INQUIRY_CATEGORY[0],
      message: "",
      contact: "",
    },
  });

  const onSubmit = async (data: InquiryFormType) => {
    try {
      const { error } = await supabase.from("inquiry").insert([
        {
          inquiry_category: data.inquiry_category,
          message: data.message,
          contact: data.contact ? data.contact : "",
        },
      ]);

      if (error) throw error;

      toast.success("문의가 등록되었습니다.");
      reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`);
      } else {
        toast.error("문의 등록 실패: 알 수 없는 에러가 발생했습니다.");
      }
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <MailQuestionMark />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-left">문의하기</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8">
            <div className="flex flex-col gap-2">
              <Label className="text-sm">카테고리</Label>
              <Controller
                name="inquiry_category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INQUIRY_CATEGORY.map((ctg) => (
                        <SelectItem key={ctg} value={ctg}>
                          {ctg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.inquiry_category && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.inquiry_category.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message" className="text-sm">
                내용
              </Label>
              <Textarea
                id="message"
                placeholder="내용을 입력해주세요."
                className="resize-none min-h-24"
                {...register("message")}
              />
              <p className="text-xs text-foreground/50">
                아이템 이미지 제보는 qmarket.cs@gmail.com으로 보내주세요.
              </p>
              {errors.message && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contact" className="text-sm">
                연락처 <span className="text-gray-400">(선택)</span>
              </Label>
              <Input
                id="contact"
                type="email"
                placeholder="이메일"
                {...register("contact")}
              />
              {errors.contact && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.contact.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                닫기
              </Button>
            </DialogClose>
            <Button disabled={isSubmitting || !isValid}>
              {isSubmitting ? "등록 중..." : "등록하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInquiryModal;
