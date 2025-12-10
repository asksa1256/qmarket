import { NextResponse } from "next/server";
import { USER_PROFILES_TABLE_NAME } from "@/shared/config/constants";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password, nickname } = await req.json();

    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signUpError || !userData.user) {
      return NextResponse.json(
        { error: signUpError?.message ?? "회원가입 실패" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from(USER_PROFILES_TABLE_NAME)
      .select("id")
      .eq("nickname", nickname)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "이미 사용 중인 닉네임입니다." },
        { status: 409 }
      );
    }

    const { error } = await supabase.from(USER_PROFILES_TABLE_NAME).insert([
      {
        id: userData.user.id,
        nickname,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "이미 사용 중인 닉네임입니다." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: userData.user });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message ?? "서버 오류" },
        { status: 500 }
      );
    }
  }
}
