"use client";

import { useForm } from "react-hook-form";
import {
  SignUpFormSchema,
  SignUpFormValues,
} from "@/features/auth/signup/model/SignUpFormSchema";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";

export default function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    trigger,
    getValues,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    mode: "onChange",
  });

  const password = watch("password") || "";

  // password 변경 시 passwordChk 필드도 다시 검사
  useEffect(() => {
    const passwordChk = getValues("passwordChk");

    if (password.length >= 8 && passwordChk) {
      trigger("passwordChk");
    }
  }, [password, trigger, getValues]);

  const onSubmit = async (data: SignUpFormValues) => {
    const payload = {
      email: data.email,
      password: data.password,
      nickname: data.nickname,
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error);
      } else {
        toast.success(
          "회원가입에 성공했습니다. 이메일 계정 인증을 완료해주세요."
        );
        reset();

        // 이메일 인증 페이지로 이동
        router.push(`/auth-email?email=${encodeURIComponent(payload.email)}`);
      }
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else toast.error("알 수 없는 에러가 발생했습니다.");
    }
  };

  return (
    <div className="w-md mx-auto mt-10 p-6 pb-12">
      <ButtonToMain className="mb-4" />

      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold mb-1">회원가입</h2>
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
          <p className="text-gray-500 text-xs mt-2">
            * 이메일 인증 후 가입이 완료됩니다. 인증 메일을 받을 수 있는 주소를
            입력해주세요.
          </p>
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
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <Label
            htmlFor="pwChk"
            className="block mb-2 text-gray-800 font-medium"
          >
            비밀번호 확인
          </Label>
          <Input
            id="pwChk"
            type="password"
            placeholder="비밀번호 확인"
            {...register("passwordChk")}
          />
          {errors.passwordChk && (
            <p className="text-red-600 text-sm mt-1">
              {errors.passwordChk.message}
            </p>
          )}
        </div>

        {/* 닉네임 */}
        <div>
          <Label
            htmlFor="nickname"
            className="block mb-2 text-gray-800 font-medium"
          >
            닉네임
          </Label>
          <Input
            id="nickname"
            type="text"
            placeholder="큐플레이 또는 디스코드 닉네임"
            {...register("nickname")}
          />
          {errors.nickname && (
            <p className="text-red-600 text-sm mt-1">
              {errors.nickname.message}
            </p>
          )}
        </div>

        {/* 버튼 */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "가입 중..." : "가입하기"}
        </Button>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        계정이 있으신가요?{" "}
        <Link
          href="/signin"
          className="font-medium text-blue-600 underline underline-offset-4"
        >
          로그인하기
        </Link>
      </p>
    </div>
  );
}
