import type { Metadata } from "next";
import { pretendard } from "@/shared/config/fonts";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import Header from "@/shared/ui/Header";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import "@/globals.css";

export const metadata: Metadata = {
  title: "큐마켓 | 2025 베스트 드레서 컨테스트",
  description:
    "2025 큐플레이 베스트 드레서 컨테스트에 참가하고 기프티콘도 받자!",
};

export default async function EventPageLayout({
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
