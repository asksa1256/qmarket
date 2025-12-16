import { cache } from "react";
import { getSupabaseServerCookie } from "@/shared/api/supabase-cookie";

// 서버 컴포넌트에서 로그인 여부 확인하는 함수
export const getUserServer = cache(async () => {
  const supabase = await getSupabaseServerCookie();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    // 비로그인 상태만 전달
    return null; // throw Error 대신 null 리턴 (throw Error 적용하면 로그아웃 시 에러 화면으로 이동됨)
  }
});
