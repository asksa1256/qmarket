import { NextResponse } from "next/server";
import { createClient } from "@/shared/api/supabase-server-cookie";
import { createClient as createSupabaseClient } from "@supabase/supabase-js"; // 관리자 클라이언트 생성용
import { DiscordGuild } from "@/features/auth/signin/model/discord";

const TARGET_GUILD_ID = "1303996406268428288";

// 절대 경로 생성 함수
function toAbsoluteUrl(req: Request, path: string): string {
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  return `${baseUrl}${path}`;
}

// 관리자 권한 클라이언트 생성 함수 (특정 길드 멤버 아니면 supabase 계정 삭제)
function createAdminClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_KEY
  ) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code)
    return NextResponse.redirect(toAbsoluteUrl(req, "/signin?error=no_code"));

  let supabaseAdmin;
  try {
    supabaseAdmin = createAdminClient();
  } catch (e) {
    console.error("Admin Client Creation Error:", e);
    return NextResponse.redirect(
      toAbsoluteUrl(
        req,
        `/signin?error=admin_client_fail&msg=${encodeURIComponent(String(e))}`
      )
    );
  }

  const supabase = await createClient();

  try {
    // 1. OAuth code를 Supabase 세션으로 교환
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      console.error("Supabase OAuth Failed:", error);
      return NextResponse.redirect(
        toAbsoluteUrl(
          req,
          `/signin?error=oauth_failed&msg=${encodeURIComponent(
            error?.message || "unknown"
          )}`
        )
      );
    }

    const accessToken = data.session.provider_token;
    const userId = data.session.user.id;

    // 2. Access Token이 없는 경우 (Discord 로그인이 불완전함)
    if (!accessToken) {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        userId
      );
      if (deleteError) {
        console.error("Failed to delete user after no_token:", deleteError);
      }

      // 브라우저 세션 제거
      await supabase.auth.signOut();
      return NextResponse.redirect(
        toAbsoluteUrl(req, "/signin?error=no_token")
      );
    }

    // 3. Discord 길드 멤버 확인
    const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      // Discord API 호출 실패 시
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        userId
      );
      if (deleteError) {
        console.error(
          "Failed to delete user after guild_fetch_failed:",
          deleteError
        );
      }
      await supabase.auth.signOut();
      return NextResponse.redirect(
        toAbsoluteUrl(req, "/signin?error=guild_fetch_failed")
      );
    }

    const guilds: DiscordGuild[] = await res.json();
    const isMember = guilds.some((g) => g.id === TARGET_GUILD_ID);

    if (!isMember) {
      // 4. 가입되지 않은 유저는 세션 삭제 (Discord API 호출 성공 && 길드 미포함)
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        userId
      );
      if (deleteError) {
        console.error("Failed to delete non-member user:", deleteError);
      }
      await supabase.auth.signOut();
      return NextResponse.redirect(toAbsoluteUrl(req, "/discord-join"));
    }

    // 길드까지 모두 가입된 유저는 메인 페이지로 이동
    return NextResponse.redirect(toAbsoluteUrl(req, "/"));
  } catch (e) {
    // 그외 에러 (네트워크, DB 등)
    console.error("Critical API Route Error:", e);

    // 에러 메시지를 포함하여 리디렉션
    return NextResponse.redirect(
      toAbsoluteUrl(
        req,
        `/signin?error=critical_error&msg=${encodeURIComponent(String(e))}`
      )
    );
  }
}
