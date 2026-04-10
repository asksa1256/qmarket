import { FetchError } from "@/shared/config/types";

const getRotationMonths = async (): Promise<{
  data: string[];
  error: FetchError | null;
}> => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error(
      "Supabase 환경 변수(SUPABASE_URL, SUPABASE_ANON_KEY)가 설정되지 않았습니다."
    );
  }

  const queryParams = new URLSearchParams({
    select: "rotation_date",
    order: "rotation_date.desc",
  });
  queryParams.append("rotation_date", "not.is.null");

  const url = `${SUPABASE_URL}/rest/v1/items_info?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      next: {
        revalidate: 3600, // 1시간 캐시
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const httpError: FetchError = {
        message: `API 오류 (HTTP ${response.status}): ${errorText.substring(0, 100)}`,
        status: response.status,
      };
      return { data: [], error: httpError };
    }

    const data: { rotation_date: string }[] = await response.json();

    // YYYY-MM 형식으로 변환 후 중복 제거
    const months = [
      ...new Set(
        data
          .filter((item) => item.rotation_date)
          .map((item) => item.rotation_date.substring(0, 7))
      ),
    ];

    return { data: months, error: null };
  } catch (error) {
    console.error("로테이션 월 목록 가져오기 중 오류 발생:", error);

    const fetchError: FetchError = {
      message:
        error instanceof Error
          ? `데이터 fetch 오류: ${error.message}`
          : "알 수 없는 오류",
      status: undefined,
    };

    return { data: [], error: fetchError };
  }
};

export default getRotationMonths;
