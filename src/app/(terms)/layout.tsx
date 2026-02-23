import type { Metadata } from "next";
import { pretendard } from "@/shared/config/fonts";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import Header from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import "@/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.q-market.kr"),
  title: "Q-Market 이용약관 | 개인정보처리방침",
  description: "큐마켓 이용약관, 개인정보 처리방침 안내",
  robots: { index: false, follow: false },
  openGraph: {
    siteName: "Q-Market",
    title: "Q-Market 이용약관 | 개인정보처리방침",
    description: "큐마켓 이용약관, 개인정보 처리방침 안내",
  },
};

export default async function TermsLayout({
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
          <Footer className="bg-gray-50" />
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
