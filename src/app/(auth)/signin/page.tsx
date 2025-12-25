import { Suspense } from "react";
import UrlCleaner from "@/shared/lib/UrlCleaner";
import SignInForm from "@/features/auth/signin/ui/SignInForm";
import SignInErrorBox from "@/features/auth/ui/SignInErrorBox";

type SearchParams = { [key: string]: string | string[] | undefined };

interface SignInPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = await searchParams;
  const isError = resolvedSearchParams.error;
  const errorMessage =
    resolvedSearchParams.msg || "알 수 없는 에러가 발생했습니다.";

  return (
    <>
      {/* URL에서 만료된 인가 코드나 error 파라미터 제거 */}
      <Suspense fallback={null}>
        <UrlCleaner />
      </Suspense>

      {isError ? (
        <SignInErrorBox errorMessage={errorMessage} />
      ) : (
        <section className="flex items-center justify-center min-h-screen">
          <SignInForm />
        </section>
      )}
    </>
  );
}
