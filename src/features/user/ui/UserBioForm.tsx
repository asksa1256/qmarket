"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BioFormType, bioFormSchema } from "../model/userSchema";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/shared/api/supabase-client";
import { USER_PROFILES_TABLE_NAME } from "@/shared/config/constants";
import { UserDetail } from "../model/userTypes";

export default function UserBioForm({ user }: { user: UserDetail }) {
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<BioFormType>({
    resolver: zodResolver(bioFormSchema),
    defaultValues: {
      bio: user.bio || "",
    },
  });

  const onSubmit = async (data: BioFormType) => {
    try {
      const { error } = await supabase
        .from(USER_PROFILES_TABLE_NAME)
        .update({ bio: data.bio })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("자기소개가 수정되었습니다.");
      user.bio = data.bio;
      setIsEditMode(false);
    } catch (error) {
      console.error("자기소개 수정 에러:", error);
      toast.error("자기소개 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    reset({ bio: user.bio || "" });
    setIsEditMode(false);
  };

  if (isEditMode)
    return (
      <form
        className="flex flex-col gap-4 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Textarea
          {...register("bio")}
          placeholder="자기소개를 입력해주세요."
          className={errors.bio ? "border-red-500" : ""}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm mt-1 text-left">
            {errors.bio.message}
          </p>
        )}

        <div className="flex gap-2">
          <Button disabled={isSubmitting || !isDirty} className="grow">
            수정
          </Button>
          <Button
            type="button"
            variant="outline"
            className="grow"
            onClick={handleCancel}
          >
            취소
          </Button>
        </div>
      </form>
    );

  return (
    <div className="flex gap-2 items-center justify-center">
      <p className="text-sm text-foreground/70">
        {!user.bio ? "자기소개를 입력해주세요." : user.bio}
      </p>
      <Button
        variant="ghost"
        aria-label="수정하기"
        title="수정하기"
        className="has-[>svg]:px-1 h-auto py-1"
        onClick={() => setIsEditMode(true)}
      >
        <Edit />
      </Button>
    </div>
  );
}
