"use client";

import { useForm } from "react-hook-form";
import {
  SignUpFormSchema,
  SignUpFormValues,
} from "@/features/sign-up-form/model/SignUpFormSchema";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { useEffect } from "react";

export default function SignUpForm() {
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
  }, [password, trigger]);

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
        toast.success("회원가입에 성공했습니다!");
        reset();
      }
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else toast.error("알 수 없는 에러가 발생했습니다.");
    }
  };

  return (
    <div className="w-md mx-auto mt-10 p-6">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold mb-1">회원가입</h2>
        <p className="text-gray-500 text-sm">
          회원가입 후 아이템 등록 기능을 사용할 수 있습니다.
        </p>
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
            placeholder="인게임/디스코드 닉네임"
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
    </div>
  );
}
