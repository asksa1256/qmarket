"use client";

import { login } from "../model/actions";
import { useForm } from "react-hook-form";
import {
  SignInFormSchema,
  SignInFormValues,
} from "@/features/auth/signin/model/SignInFormSchema";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      const res = await login();

      if (res.url) {
        window.location.href = res.url;
      }

      // toast.success("로그인 성공!");

      // 메인 페이지로 이동
      // router.push("/");
    } catch (err) {
      console.log(err);

      if (err instanceof Error) {
        const errMsg = err.message;
        if (
          errMsg.includes("Invalid login credentials") ||
          errMsg.includes("not confirmed")
        ) {
          toast.error(
            "이메일 인증이 완료되지 않았거나, 비밀번호가 올바르지 않습니다."
          );
        } else {
          toast.error(err.message);
        }
        return;
      }
    }
  };

  return (
    <div className="w-md mx-auto mt-10 p-6">
      <ButtonToMain className="mb-4" />

      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold mb-1">로그인</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 이메일 */}
        <div>
          <Label
            htmlFor="email"
            className="block mb-2 text-gray-800 font-medium"
          >
            이메일
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="이메일"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <Label htmlFor="pw" className="block mb-2 text-gray-800 font-medium">
            비밀번호
          </Label>
          <Input
            id="pw"
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 underline underline-offset-4"
        >
          회원가입하기
        </Link>
      </p>
    </div>
  );
}
