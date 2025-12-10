import { FetchError } from "@/shared/config/types";

const getRotationItems = async ({
  dateFormat,
  nextYear,
  nextMonth,
  gender,
  source,
}: {
  dateFormat: string;
  nextYear: number;
  nextMonth: number;
  gender: string;
  source: string;
}) => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error(
      "Supabase 환경 변수(SUPABASE_URL, SUPABASE_ANON_KEY)가 설정되지 않았습니다."
    );
  }

  // PostgREST 쿼리 파라미터 구성
  const queryParams = new URLSearchParams({
    select: "*",
    item_gender: `eq.${gender}`,
    item_source: `eq.${source}`,
    order: "name.asc",
  });

  queryParams.append("rotation_date", `gte.${dateFormat}-01`);
  queryParams.append(
    "rotation_date",
    `lt.${nextYear}-${String(nextMonth).padStart(2, "0")}-01`
  );

  // REST API URL 구성
  const url = `${SUPABASE_URL}/rest/v1/items_info?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      cache: "force-cache", // 정적 렌더링(ssg)
    });

    if (!response.ok) {
      const errorText = await response.text();

      const httpError: FetchError = {
        message: `API 오류 (HTTP ${response.status}): ${errorText.substring(
          0,
          100
        )}`,
        status: response.status,
      };

      return { data: [], error: httpError };
    }

    const data = await response.json();

    return { data: data || [], error: null };
  } catch (error) {
    console.error("데이터 가져오기 중 오류 발생:", error);

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

export default getRotationItems;
