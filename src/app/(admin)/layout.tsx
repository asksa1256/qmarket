import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getUserServer } from "@/shared/api/get-supabase-user-server";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { galmuri9 } from "@/shared/config/fonts";
import "@/globals.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 관리자 권한 체크
  const user = await getUserServer();

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    redirect("/");
  }

  // QueryClient 생성 및 유저 데이터 프리페칭
  const queryClient = new QueryClient();

  if (user) {
    queryClient.setQueryData(["user"], user);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ko">
      <body
        className={`${galmuri9.className} antialiased min-h-screen py-12 px-4 bg-gradient-to-br from-red-50 via-yellow-50 to-purple-50`}
      >
        <QueryProvider dehydratedState={dehydratedState}>
          <HydrationBoundary state={dehydratedState}>
            {children}
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
