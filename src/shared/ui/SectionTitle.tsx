import { ReactNode } from "react";
import { cn } from "../lib/utils";

export default function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-lg md:text-2xl font-bold px-4 py-3 rounded-md bg-secondary mb-4",
        className
      )}
    >
      {children}
    </h2>
  );
}
