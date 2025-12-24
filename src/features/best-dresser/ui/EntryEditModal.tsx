"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/api/supabase-client";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { BestDresserEntry, EntryFormValues } from "../model/bestDresserType";

interface EntryEditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: BestDresserEntry;
}

export default function EntryEditModal({
  open,
  setOpen,
  data,
}: EntryEditModalProps) {
  const [isSucceeded, setIsSucceeded] = useState(false);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      imageFile: null as File | null,
      description: data.description,
    },
  });

  const onSubmit = async (values: EntryFormValues) => {
    try {
      const { error } = await supabase
        .from("best_dresser")
        .update({
          image_url: data.image_url, // 이미지 수정 불가
          description: values.description,
        })
        .eq("id", data.id);

      if (error) throw error;

      toast.success("게시글이 수정되었습니다.");
      setIsSucceeded(true);
      queryClient.invalidateQueries({ queryKey: ["best_dresser"] });

      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (error) {
      toast.error("게시글 수정에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>✏️ 아바타 수정</DialogTitle>
            <DialogDescription className="text-foreground/50 text-sm">
              * 이미지는 수정하실 수 없습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label>아바타 이미지</Label>
              <div className="relative w-[70%] mx-auto mt-2 p-2 rounded-xl">
                <img
                  src={data.image_url}
                  alt="미리보기"
                  className="rounded-lg w-full h-auto"
                />
                {isSucceeded && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <CheckCircle2 className="text-green-500 w-12 h-12" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>설명</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} className="resize-none" />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || isSucceeded}
              className="w-full"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "수정"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
