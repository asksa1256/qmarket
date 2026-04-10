"use client";

import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/shared/ui/SectionTitle";
import { useFavorites, useToggleFavorite } from "@/shared/hooks/useFavorites";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

export default function MyFavoriteSection({ userId }: { userId: string }) {
  const { data = [], isLoading } = useFavorites(userId);
  const toggleFavorite = useToggleFavorite(userId);

  const handleDelete = (itemInfoId: string, itemName: string, itemImage: string | null, itemGender: string | null) => {
    toggleFavorite.mutate({
      itemInfoId,
      itemName,
      itemImage,
      itemGender,
      isFavorited: true,
    });
  };

  return (
    <section className="md:pl-8 mb-8">
      <SectionTitle>❤️ 찜 목록</SectionTitle>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <LoadingSpinner />
        </div>
      ) : data.length === 0 ? (
        <p className="text-foreground/50 text-sm">찜한 아이템이 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data.map((item) => (
            <li key={item.id} className="relative group">
              <Link
                href={`/item/${encodeURIComponent(item.item_name)}/${item.item_gender ?? ""}`}
                className="flex flex-col items-center gap-1.5 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
              >
                <div className="relative w-14 h-16 shrink-0">
                  <Image
                    src={item.item_image || "/images/empty.png"}
                    alt={item.item_name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium line-clamp-2 leading-snug">
                    {item.item_name}
                  </p>
                  {item.item_gender && (
                    <p className="text-[10px] text-foreground/50 mt-0.5">
                      {item.item_gender === "m" ? "남" : item.item_gender === "w" ? "여" : item.item_gender}
                    </p>
                  )}
                </div>
              </Link>
              <button
                type="button"
                onClick={() =>
                  handleDelete(item.item_info_id, item.item_name, item.item_image, item.item_gender)
                }
                className="absolute top-1.5 right-1.5 p-1 rounded bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                title="찜 삭제"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
