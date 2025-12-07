import {
  ITEM_CATEGORY_NAV,
  ITEM_CATEGORY_MAP,
} from "@/shared/config/constants";
import Image from "next/image";
import Link from "next/link";

export default function ItemCategoryNav() {
  return (
    <nav className="w-full">
      <ol className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 mx-auto">
        {ITEM_CATEGORY_NAV.map((n) => (
          <li key={n.key} className="group">
            <Link
              href={n.link}
              className="flex flex-col items-center justify-center w-full aspect-[4/3] sm:aspect-square p-2 rounded-2xl border border-border bg-background/50 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* 호버 시 배경에 은은한 빛 효과 (선택사항) */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* 이미지 컨테이너 */}
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={n.image}
                  alt={n.key}
                  width={60}
                  height={60}
                  className="object-contain drop-shadow-sm"
                  style={{ width: "auto", height: "auto", maxWidth: "100%" }} // 반응형 크기 조절
                />
              </div>

              {/* 텍스트 라벨이 있다면 여기에 추가 (현재는 key로 대체하거나 생략 가능) */}
              <span className="mt-2 text-xs font-medium text-muted-foreground group-hover:text-primary truncate">
                {ITEM_CATEGORY_MAP[n.key as keyof typeof ITEM_CATEGORY_MAP]}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
