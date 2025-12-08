import type { Metadata } from "next";
import "@/globals.css";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { pretendard } from "@/shared/config/fonts";
import { Toaster } from "sonner";
import Header from "@/shared/ui/Header";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Q-Market",
  description:
    "큐플레이 아이템 구매/판매 현황, 시세 및 거래 내역, 아이템 상세 정보",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} antialiased xl:px-0 px-4`}>
        <QueryProvider>
          <Header />
          <div className="pt-12">{children}</div>
          <Footer />
          <Toaster
            position="bottom-center"
            richColors
            toastOptions={{
              className: "font-pretendard",
            }}
          />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
