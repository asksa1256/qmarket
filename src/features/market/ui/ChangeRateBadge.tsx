import { cn } from "@/shared/lib/utils";

interface ChangeRateBadgeProps {
  value: number;
  size?: "sm" | "md";
}

export default function ChangeRateBadge({
  value,
  size = "md",
}: ChangeRateBadgeProps) {
  const isRising = value > 0;
  const isFalling = value < 0;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-full",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-xs",
        isRising && "bg-red-50 text-red-600",
        isFalling && "bg-blue-50 text-blue-600",
        !isRising && !isFalling && "bg-gray-100 text-gray-600"
      )}
    >
      {isRising && "▲"}
      {isFalling && "▼"}
      {Math.abs(Math.floor(value))}%
    </span>
  );
}
