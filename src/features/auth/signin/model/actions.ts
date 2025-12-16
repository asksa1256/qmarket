"use server";

import { getSupabaseServerCookie } from "@/shared/api/supabase-cookie";
import { DiscordGuild } from "./discord";

export async function login(returnTo: string = "/") {
  const supabase = await getSupabaseServerCookie();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const encodedReturnTo = encodeURIComponent(returnTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${baseUrl}/api/auth/discord-callback?returnTo=${encodedReturnTo}`,
      scopes: "identify email guilds",
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function logout() {
  const supabase = await getSupabaseServerCookie();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return { success: true };
}

/**
 * 1. 현재 사용자 세션에서 Discord Access Token을 가져와서,
 * 2. 해당 토큰으로 Discord API를 호출하여 특정 길드(디스코드 서버) 멤버십을 확인 함수
 * @returns { isMember: boolean, error: string | null }
 */

const TARGET_GUILD_ID = "1303996406268428288";

export async function checkDiscordMember() {
  const supabase = await getSupabaseServerCookie();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { isMember: false, error: "세션 없음" };
  }

  const discordIdentity = session.user.identities?.find(
    (i) => i.provider === "discord"
  );
  const accessToken = discordIdentity?.provider_token;

  if (!accessToken) {
    return { isMember: false, error: "Discord Access Token 없음" };
  }

  try {
    const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return { isMember: false, error: `길드 목록 조회 실패: ${err}` };
    }

    const guilds: DiscordGuild[] = await res.json();

    const isMember = guilds.some((g) => g.id === TARGET_GUILD_ID);

    if (isMember) {
      return { isMember: true, error: null };
    } else {
      return {
        isMember: false,
        error: "디스코드 서버 미가입",
      };
    }
  } catch (e) {
    return { isMember: false, error: `API 오류: ${String(e)}` };
  }
}
