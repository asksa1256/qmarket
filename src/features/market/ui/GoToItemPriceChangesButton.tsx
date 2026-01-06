"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/hooks/useUser";
import DiscordIcon from "@/shared/assets/icons/DiscordIcon";
import { login } from "@/features/auth/signin/model/actions";
import { toast } from "sonner";

export default function GoToItemPriceChangesButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: user } = useUser();

  const handleNavigate = () => {
    if (!user) {
      setOpen(true);
      return;
    }

    router.push("/item-price-changes");
  };

  const handleSignIn = async () => {
    try {
      const res = await login("/item-price-changes");
      window.location.href = res.url;
    } catch (err) {
      toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
      console.log(err);
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full text-base mt-4 p-6"
        onClick={handleNavigate}
      >
        시세 변동 내역 전체보기
        <ArrowRight className="size-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-center">
              시세 변동 내역 전체보기
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <ul className="mb-4 text-[15px] text-foreground/60">
            <li>
              - <b>로그인 후 전체 시세 변동 내역을 보실 수 있습니다.</b>
            </li>
            <li>- 추가 가입 없이 디스코드 계정으로 이용 가능합니다.</li>
          </ul>

          <Button
            size="lg"
            className="mb-2 w-auto justify-self-center bg-discord hover:bg-discord-hover"
            onClick={handleSignIn}
          >
            <DiscordIcon className="w-6 h-6 text-white" /> 디스코드로 로그인
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
