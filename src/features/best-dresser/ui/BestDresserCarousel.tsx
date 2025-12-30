"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BestDresserRanked } from "../model/bestDresserType";
import InstaCard from "@/shared/ui/InstaCard";
import { TABLET_MIN_WIDTH } from "@/shared/config/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BestDresserCarousel({
  data,
}: {
  data: BestDresserRanked[];
}) {
  SwiperCore.use([Navigation, Autoplay]);

  return (
    <div className="relative group mx-4">
      <Swiper
        loop={true}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        breakpoints={{
          [TABLET_MIN_WIDTH]: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {data.map((entry, i) => (
          <SwiperSlide key={entry.id}>
            <li key={entry.id}>
              <InstaCard data={entry} idx={i} />
            </li>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="custom-prev hidden lg:block absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50 disabled:opacity-30 transition-all">
        <ChevronLeft className="size-6" />
      </button>

      <button className="custom-next hidden lg:block absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50 disabled:opacity-30 transition-all">
        <ChevronRight className="size-6" />
      </button>
    </div>
  );
}
