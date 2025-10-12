import SignInForm from "@/features/sign-in-form/ui/SignInForm";
import SignInErrorBox from "@/widgets/auth/ui/SignInErrorBox";

type SearchParams = { [key: string]: string | string[] | undefined };

interface SignInPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = await searchParams;
  const isError = resolvedSearchParams.error;
  const errorMessage =
    resolvedSearchParams.msg || "알 수 없는 에러가 발생했습니다.";

  return isError ? (
    <SignInErrorBox errorMessage={errorMessage} />
  ) : (
    <section className="flex items-center justify-center min-h-screen">
      <SignInForm />
    </section>
  );
}
