"use client";

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
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/shared/api/supabase-client";
import { useUser } from "@/shared/hooks/useUser";
import { REPORT_CATEGORY } from "@/shared/config/constants";
import { ReportFormData, reportFormSchema } from "../model/reportFormSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/shared/ui/label";

interface CreateReportModalProps {
  initialData?: {
    report_category?: string;
    item_name?: string;
    user_id?: string;
    details?: string;
  };
  trigger?: React.ReactNode;
}

const CreateReportModal = ({ initialData, trigger }: CreateReportModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useUser();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      report_category: initialData?.report_category || "",
      item_name: initialData?.item_name || "",
      user_id: initialData?.user_id || "",
      details: initialData?.details || "",
    },
  });

  // 모달이 열릴 때 initialData가 바뀌면 폼 초기화
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        report_category: initialData.report_category || "",
        item_name: initialData.item_name || "",
        user_id: initialData.user_id || "",
        details: initialData.details || "",
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: ReportFormData) => {
    try {
      const { error } = await supabase.from("report").insert([
        {
          report_category: data.report_category,
          item_name: data.item_name || null,
          user_id: data.user_id || null,
          details: data.details,
          contact: user?.email,
        },
      ]);

      if (error) throw error;

      toast.success("신고가 접수되었습니다.");
      reset();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`신고 접수 실패: ${error.message}`);
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="link" size="sm" className="p-0 text-xs">
            신고
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-left">🚨 신고하기</DialogTitle>
          <DialogDescription className="break-keep text-left">
            사기 행위, 시세 조작, 비매너 행위 등의 내용을 제보해주세요.
            <br />
            허위 신고 시 계정이 제재될 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            {/* 카테고리 */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm">카테고리</Label>
              <Controller
                name="report_category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_CATEGORY.map((ctg) => (
                        <SelectItem key={ctg} value={ctg}>
                          {ctg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.report_category && (
                <p className="text-red-600 text-sm">
                  {errors.report_category.message}
                </p>
              )}
            </div>

            {/* 신고 대상 아이템 */}
            <div className="flex flex-col justify-center gap-2">
              <Label htmlFor="item_name" className="text-sm font-medium">
                신고 대상 아이템
              </Label>
              <Input
                id="item_name"
                {...register("item_name")}
                placeholder="아이템명(성별)"
                className="col-span-3"
              />
              {errors.item_name && (
                <p className="text-red-600 text-sm">
                  {errors.item_name.message}
                </p>
              )}
            </div>

            {/* 신고 대상 아이디 */}
            <div className="flex flex-col justify-center gap-2">
              <Label htmlFor="user_id" className="text-sm font-medium">
                신고 대상 아이디
              </Label>
              <Input
                id="user_id"
                {...register("user_id")}
                placeholder="디스코드 아이디"
                className="col-span-3"
              />
              {errors.user_id && (
                <p className="text-red-600 text-sm">
                  {errors.user_id.message}
                </p>
              )}
            </div>

            {/* 신고 내용 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="details" className="text-sm font-medium">
                신고 내용
              </Label>
              <Textarea
                id="details"
                {...register("details")}
                placeholder="내용을 입력해주세요."
                className="resize-none min-h-24"
              />
              {errors.details && (
                <p className="text-red-600 text-sm">{errors.details.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                닫기
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? "등록 중..." : "등록하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportModal;
