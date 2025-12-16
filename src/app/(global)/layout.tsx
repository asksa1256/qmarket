import type { Metadata } from "next";
import "@/globals.css";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { pretendard } from "@/shared/config/fonts";
import { Toaster } from "sonner";
import Header from "@/shared/ui/Header";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/shared/ui/Footer";
import { getUserServer } from "@/shared/api/get-supabase-user-server";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Q-Market",
  description:
    "큐플레이 아이템 거래 현황 및 시세 조회, 아이템 거래 등록, 아이템 상세 정보",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  // 유저 데이터 요청 최적화
  const user = await getUserServer();

  if (user) {
    queryClient.setQueryData(["user"], user);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ko">
      <body className={`${pretendard.className} antialiased`}>
        <QueryProvider dehydratedState={dehydratedState}>
          <Header />

          <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="pt-12 xl:px-0 px-4">{children}</div>
          </HydrationBoundary>

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
