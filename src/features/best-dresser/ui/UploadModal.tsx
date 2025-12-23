"use client";

import { useState, ChangeEvent } from "react";
import { supabase } from "@/shared/api/supabase-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Camera, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getUploadUrl } from "@/app/actions/s3-actions";
import { useUser } from "@/shared/hooks/useUser";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface DresserFormValues {
  imageFile: File | null;
  description: string;
}

export default function BestDresserUploadModal() {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSucceeded, setIsSucceeded] = useState(false);

  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<DresserFormValues>({
    defaultValues: {
      imageFile: null,
      description: "",
    },
  });

  // 이미지 파일 미리보기
  const imageFile = watch("imageFile");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      toast.error("2MB 이하의 파일을 선택해주세요.");
      e.target.value = "";
      return;
    }

    if (selectedFile) {
      setValue("imageFile", selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setIsSucceeded(false);
    }
  };

  const onSubmit = async (values: DresserFormValues) => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!values.imageFile) {
      toast.error("이미지를 등록해주세요.");
      return;
    }

    try {
      const { signedUrl, fileUrl } = await getUploadUrl(
        values.imageFile.name,
        values.imageFile.type
      );

      await fetch(signedUrl, {
        method: "PUT",
        body: values.imageFile,
        headers: { "Content-Type": values.imageFile.type },
      });

      const { error } = await supabase.from("best_dresser").insert({
        image_url: fileUrl,
        user_id: user.id,
        nickname: user.user_metadata.custom_claims?.global_name,
        votes: 0,
        description: values.description,
      });

      if (error) throw error;

      await queryClient.invalidateQueries({
        queryKey: ["best_dresser"],
      });

      toast.success("컨테스트에 참가되었습니다!");
      setIsSucceeded(true);

      // 참가 폼 초기화
      reset();
      setPreviewUrl(null);

      // 모달 닫기
      setOpen(false);
    } catch (error) {
      console.error("실패:", error);
      toast.error("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setIsSucceeded(false);
          reset();
          setPreviewUrl(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-base rounded-2xl shadow-lg transition-all transform hover:scale-105"
        >
          <Camera className="size-5" />
          컨테스트 참여하기
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-xl border-none shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              📸 아바타 등록
            </DialogTitle>
            <DialogDescription className="text-foreground/50 text-sm">
              배경까지 포함된 아바타 이미지를 등록해주세요!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            {/* 이미지 필드 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="photo" className="text-foreground font-medium">
                아바타 스크린샷 (최대 2MB)
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isSubmitting || isSucceeded}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-50 file:text-pink-700
                  hover:file:bg-pink-100
                  disabled:opacity-50 cursor-pointer"
              />

              {previewUrl && (
                <div className="relative mt-2 p-2 rounded-xl w-[75%] mx-auto overflow-hidden bg-gradient-to-b from-[#53A0DA] to-[#2359B6] border-2 border-[#002656] shadow-lg">
                  <img
                    src={previewUrl}
                    alt="미리보기"
                    className="block mx-auto rounded-lg object-contain w-full h-auto transition-opacity duration-300"
                  />
                  {isSucceeded && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 설명 필드 */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="description"
                className="text-foreground font-medium"
              >
                설명
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="코디 컨셉을 설명해주세요! (선택)"
                    disabled={isSubmitting || isSucceeded}
                    className="resize-none focus-visible:ring-pink-400"
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !imageFile || isSucceeded}
              className={`w-full py-6 rounded-xl font-bold transition-all ${
                isSucceeded
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  업로드 중...
                </>
              ) : isSucceeded ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  등록 완료
                </>
              ) : (
                "컨테스트 참가하기"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
