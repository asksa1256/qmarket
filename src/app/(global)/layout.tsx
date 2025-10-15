import type { Metadata } from "next";
import "@/globals.css";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { pretendard } from "@/shared/config/fonts";
import { Toaster } from "sonner";
import Header from "@/widgets/header/ui/Header";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Q-Market",
  description: "큐플레이 아이템 시세/판매 현황 조회",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} antialiased`}>
        <QueryProvider>
          <Header />
          {children}
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
