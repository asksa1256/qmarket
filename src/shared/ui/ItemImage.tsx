import Image from "next/image";
import { cn } from "../lib/utils";

export interface ItemImageProps {
  name: string;
  imgUrl: string | null;
  size?: "sm" | "lg";
  className?: string;
}

export default function ItemImage({
  name,
  imgUrl,
  size = "lg",
  className,
}: ItemImageProps) {
  return (
    <figure
      className={cn(
        "relative flex-shrink-0 rounded-md overflow-hidden",
        className
      )}
    >
      <Image
        src={imgUrl ?? "/images/empty.png"}
        alt={name}
        width={size === "lg" ? 100 : 40}
        height={size === "lg" ? 122 : 48}
        className="object-cover"
      />
    </figure>
  );
}
