import { Send, Crown } from "lucide-react";
import { BestDresserRanked } from "@/features/best-dresser/model/bestDresserType";
import HeartFill from "./Icon/HeartFill";
import Image from "next/image";
import Link from "next/link";
import { getRankStyles } from "@/features/best-dresser/model/getRankStyles";
import { CUSTOM_ENTRY_TAGS } from "../config/constants";

interface InstaCardProps {
  data: BestDresserRanked;
  idx: number;
}

export default function InstaCard({ data, idx }: InstaCardProps) {
  const rankStyles = getRankStyles(data.rank);

  return (
    <div
      className={`
      max-w-[320px] h-full mx-auto rounded-xl border-2 shadow-2xl
      ${rankStyles.cardBg} ${rankStyles.border}
    `}
    >
      <Link href={`/best-dresser/${data.id}`}>
        {/* 카드 헤더 */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            {/* 순위 배지 */}
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-xs shadow-sm ${rankStyles.badge}`}
            >
              {data.rank}
            </span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{data.nickname}</span>
              {data.rank <= 3 && (
                <Crown
                  className={`size-3.5 ${rankStyles.crown}`}
                  fill="currentColor"
                />
              )}
            </div>
          </div>
        </div>

        {/* 이미지 */}
        <div className="relative w-[184px] h-[236px] mx-auto rounded-md overflow-hidden my-2 border border-gray-100 shadow-inner hover:scale-105 transition-all">
          <Image src={data.image_url} alt="" fill className="object-cover" />
          <div
            className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${rankStyles.badge} shadow-md`}
          >
            {rankStyles.label}
          </div>
        </div>

        {/* actions */}
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1">
                <HeartFill className="size-6 text-[#EE415C]" />
                <b className="mt-0.5">{data.votes}</b>
              </span>
              <Send className="size-5 cursor-pointer" />
            </div>
          </div>

          {/* 좋아요 + 설명 */}
          <div className="space-y-1 bg-background/50 rounded-md p-2">
            <div className="text-sm line-clamp-2 min-h-[40px]">
              <span className="font-semibold mr-1">{data.nickname}</span>
              {data.description}
            </div>
            <span className="text-blue-800 mt-1 text-sm">
              {CUSTOM_ENTRY_TAGS(idx)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
