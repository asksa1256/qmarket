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
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/shared/api/supabase-client";
import { sanitize } from "@/shared/lib/sanitize";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { ItemFormValues, ItemFormSchema } from "../model/schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ITEM_SOURCES_MAP, ITEM_GENDER_MAP } from "@/shared/config/constants";
import { Lock, Plus } from "lucide-react";
import { useUser } from "@/shared/providers/UserProvider";
import { useState } from "react";

export default function ItemUploadModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const user = useUser();

  const createItemMutation = useMutation({
    mutationFn: async (values: ItemFormValues) => {
      const dataToInsert = {
        item_name: sanitize(values.item_name),
        price: values.price,
        is_sold: values.is_sold === "sold",
        is_online: values.is_online === "online",
        item_source: ITEM_SOURCES_MAP[values.item_source],
        nickname: user?.nickname,
        item_gender: ITEM_GENDER_MAP[values.item_gender],
        user_id: user?.id,
      };

      const { data, error } = await supabase
        .from("items")
        .insert([dataToInsert])
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      toast.success("상품이 등록되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (err) => {
      toast.error("상품 등록에 실패했습니다.");
      console.error(err);
    },
  });

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      item_name: "",
      price: 0,
      is_sold: "selling",
      is_online: "online",
      item_source: "gatcha",
      item_gender: "m",
    },
  });

  const { register, handleSubmit, control, reset } = form;

  const onSubmit = (values: ItemFormValues) => {
    createItemMutation.mutate(values, {
      onSuccess: () => {
        reset(); // 폼 초기화
      },
    });
  };

  const handleItemUploadOpen = () => {
    if (user) {
      setOpen(true);
    } else {
      setOpen(false);
      toast.error("로그인이 필요합니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="default"
        className="w-auto mx-auto font-bold bg-blue-600 hover:bg-blue-700"
        onClick={handleItemUploadOpen}
      >
        {user ? <Plus /> : <Lock />} 아이템 등록
      </Button>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>아이템 등록하기</DialogTitle>
          <DialogDescription className="flex flex-col">
            <span>판매중인 아이템 정보를 등록해주세요.</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="grid gap-8 px-2">
              <div className="grid gap-3">
                <label htmlFor="item_name" className="text-sm">
                  아이템명
                </label>
                <Input
                  id="item_name"
                  placeholder="상품명"
                  {...register("item_name")}
                />
              </div>

              <div className="grid gap-3">
                <label htmlFor="price" className="text-sm">
                  가격
                </label>
                <Input
                  id="price"
                  type="number"
                  placeholder="가격"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>

              {/* 아이템 성별 */}
              <div className="grid gap-3">
                <label htmlFor="item_gender1" className="text-sm">
                  아이템 성별
                </label>
                <Controller
                  name="item_gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="m" id="item_gender1" />
                        <Label htmlFor="item_gender1">
                          {ITEM_GENDER_MAP.m}
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="w" id="item_gender2" />
                        <Label htmlFor="item_gender2">
                          {ITEM_GENDER_MAP.w}
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* 판매중/판매완료 */}
              <div className="grid gap-3">
                <label htmlFor="selling1" className="text-sm">
                  판매 상태
                </label>
                <Controller
                  name="is_sold"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="selling" id="selling1" />
                        <Label htmlFor="selling1">판매중</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="sold" id="selling2" />
                        <Label htmlFor="selling2">판매완료</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* 온라인/미접속 */}
              <div className="grid gap-3">
                <label htmlFor="online1" className="text-sm">
                  접속 상태
                </label>
                <Controller
                  name="is_online"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="online" id="online1" />
                        <Label htmlFor="online1">온라인</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="offline" id="online2" />
                        <Label htmlFor="online2">미접속</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* 아이템 출처 */}
              <div className="grid gap-3">
                <label htmlFor="source1" className="text-sm">
                  아이템 출처
                </label>
                <Controller
                  name="item_source"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="gatcha" id="source1" />
                        <Label htmlFor="source1">뽑기</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="shop" id="source2" />
                        <Label htmlFor="source2">상점</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="magic" id="source3" />
                        <Label htmlFor="source3">요술상자</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="lottery" id="source3" />
                        <Label htmlFor="source3">복권</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">닫기</Button>
              </DialogClose>
              <Button type="submit" disabled={createItemMutation.isPending}>
                {createItemMutation.isPending ? "등록 중..." : "등록하기"}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
