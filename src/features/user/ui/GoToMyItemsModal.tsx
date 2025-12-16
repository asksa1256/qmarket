"use client";

import { useState, MouseEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/hooks/useUser";
import DiscordIcon from "@/shared/assets/icons/DiscordIcon";
import { login } from "@/features/auth/signin/model/actions";
import { toast } from "sonner";
import Link from "next/link";

export default function GoToMyItemsModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: user } = useUser();

  const handleGoToMyItems = (e: MouseEvent) => {
    if (!user) {
      e.preventDefault(); // Link 기본 이동 막기
      setOpen(true);
      return;
    }

    router.push("/my-items");
  };

  const handleSignIn = async () => {
    try {
      const res = await login("/my-items");
      window.location.href = res.url;
    } catch (err) {
      toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
      console.log(err);
    }
  };

  return (
    <>
      <Link href="/my-items" className="h-full" onClick={handleGoToMyItems}>
        <div className="h-full p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors break-keep">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
            구매/판매 아이템 등록 <ExternalLink className="size-4" />
          </h3>
          <p className="text-muted-foreground">
            구매/판매 중인 아이템을 등록할 수 있습니다.
          </p>
        </div>
      </Link>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-center">
              구매/판매 아이템 등록하기
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <ul className="mb-4 text-[15px] text-foreground/60">
            <li>
              - <b>로그인 후 거래하실 아이템을 등록할 수 있습니다.</b>
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
