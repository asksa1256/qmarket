"use client";

import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function ButtonToBestDresserPage({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className={className}
      onClick={() => router.push("/best-dresser")}
    >
      전체보기 <ChevronRight />
    </Button>
  );
}
