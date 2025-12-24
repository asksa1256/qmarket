import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../../../public/fonts/Pretendard-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Pretendard-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Pretendard-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-pretendard",
});

export const galmuri9 = localFont({
  src: [
    {
      path: "../../../public/fonts/Galmuri9.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-galmuri9",
});
