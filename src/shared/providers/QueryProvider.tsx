"use client";

import { ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";

interface QueryProviderProps {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

export function QueryProvider({
  children,
  dehydratedState,
}: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* 서버에서 직렬화된 데이터를 클라이언트 캐시에 주입 */}
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
