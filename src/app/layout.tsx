import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "./shared/providers/QueryProvider";
import { pretendard } from "./shared/config/fonts";
import { Toaster } from "sonner";
import Header from "./widgets/header/ui/Header";
import { UserProvider, UserType } from "./shared/providers/UserProvider";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Q-Market",
  description: "큐플레이 실시간 아이템 판매 정보 - 시세 확인",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let serverUser: UserType | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("nickname")
      .eq("id", user.id)
      .maybeSingle();

    serverUser = {
      email: user.email!,
      nickname: profile?.nickname ?? undefined,
    };
  }

  return (
    <html lang="ko">
      <body className={`${pretendard.className} antialiased`}>
        <UserProvider user={serverUser}>
          <Header />
          <QueryProvider>{children}</QueryProvider>
          <Toaster
            position="bottom-center"
            richColors
            toastOptions={{
              className: "font-pretendard",
            }}
          />
        </UserProvider>
      </body>
    </html>
  );
}
