"use client";

import { Button } from "../button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";

export default function ButtonToBack({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className={cn("mb-8", className)}
      onClick={() => router.back()}
    >
      <ChevronLeft /> 돌아가기
    </Button>
  );
}
