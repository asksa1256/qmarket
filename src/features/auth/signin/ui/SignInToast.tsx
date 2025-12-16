"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function SignInToast() {
  useEffect(() => {
    toast.info("로그인이 필요합니다.");
  }, []);

  return null; // 토스트만 표시
}
