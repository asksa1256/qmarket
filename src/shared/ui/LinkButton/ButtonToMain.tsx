"use client";

import { Button } from "../button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";

export default function ButtonToMain({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className={cn("md:mb-8 mb-4", className)}
      onClick={() => router.push("/")}
    >
      <ArrowLeft />
      메인으로
    </Button>
  );
}
