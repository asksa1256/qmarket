"use client";

import { Button } from "../button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ButtonToMain({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className={className}
      onClick={() => router.push("/")}
    >
      <ArrowLeft />
      메인으로
    </Button>
  );
}
