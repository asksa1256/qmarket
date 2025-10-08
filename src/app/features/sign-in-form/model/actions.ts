"use server";

import { createClient } from "@/shared/api/supabase-server-cookie";

export async function login() {
  const supabase = await createClient();

  // 1. Supabase 콜백 URL
  const supabaseCallbackUrl =
    "https://enwhjnkfwjoxfswgelik.supabase.co/auth/v1/callback";

  // 2. 최종 도착 페이지의 경로를 next 파라미터로 추가
  // Supabase가 세션 처리 후 최종적으로 사용자를 보냄
  const finalRedirectUrl = `${supabaseCallbackUrl}?next=/auth-callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      // redirectTo: "https://enwhjnkfwjoxfswgelik.supabase.co/auth/v1/callback",
      redirectTo: finalRedirectUrl,
      scopes: "identify email guilds guilds.members.read",
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return { success: true };
}

const TARGET_GUILD_ID = "1303996406268428288";

/**
 * 1. 현재 사용자 세션에서 Discord Access Token을 가져옵니다.
 * 2. 해당 토큰으로 Discord API를 호출하여 특정 서버 멤버십을 확인합니다.
 * @returns { isMember: boolean, error: string | null }
 */
export async function checkDiscordMember() {
  const supabase = await createClient();

  // 사용자 세션, provider_token 가져오기
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { isMember: false, error: "사용자 세션을 찾을 수 없습니다." };
  }

  const discordIdentity = session.user.identities?.find(
    (identity) => identity.provider === "discord"
  );
  const discordAccessToken = discordIdentity?.provider_token;

  if (!discordAccessToken) {
    return {
      isMember: false,
      error:
        "Discord Access Token을 찾을 수 없습니다. Discord로 로그인했는지 확인해주세요.",
    };
  }

  // 디스코드 특정 서버 멤버 확인
  const discordApiUrl = `https://discord.com/api/v10/users/@me/guilds/${TARGET_GUILD_ID}/member`;

  try {
    const response = await fetch(discordApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${discordAccessToken}`,
        "User-Agent": "DiscordApp/1.0 (qpgg, 1.0)", // Discord API 요구사항
      },
    });

    if (response.ok) {
      // 응답 코드 200 (OK): 해당 서버 멤버
      // const memberData = await response.json();
      return { isMember: true, error: null };
    }

    // 404 (Not Found) 또는 403 (Forbidden): 멤버 아님
    return {
      isMember: false,
      error: `디스코드 '큐플레이 아카이브' 서버 가입이 필요합니다. ${response.status}`,
    };
  } catch (apiError) {
    console.error("Discord API 호출 에러:", apiError);
    return { isMember: false, error: "Discord API 통신 오류가 발생했습니다." };
  }
}
