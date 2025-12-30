"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BestDresserRanked } from "../model/bestDresserType";
import InstaCard from "@/shared/ui/InstaCard";
import { TABLET_MIN_WIDTH } from "@/shared/config/constants";

export default function BestDresserCarousel({
  data,
}: {
  data: BestDresserRanked[];
}) {
  SwiperCore.use([Navigation, Scrollbar, Autoplay]);

  return (
    <Swiper
      spaceBetween={20}
      navigation={true}
      slidesPerView={1}
      breakpoints={{
        [TABLET_MIN_WIDTH]: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      }}
    >
      {data.map((entry, i) => (
        <SwiperSlide key={entry.id}>
          <li key={entry.id}>
            <InstaCard data={entry} idx={i} />
          </li>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
