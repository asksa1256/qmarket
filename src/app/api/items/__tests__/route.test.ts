/**
 * @jest-environment node
 *
 * /api/items POST 라우트 테스트
 *
 * 오천원(5,000), 오만원(50,000), 오십만원(500,000), 오백만원(5,000,000) 가격이
 * API를 통해 DB에 정상적으로 삽입되는지 검증합니다.
 */

// jest.mock은 호이스팅되므로 팩토리 내부의 mock 함수를 requireMock으로 참조
jest.mock("@/shared/api/supabase-server", () => {
  const mockSingle = jest.fn();
  const mockSelect = jest.fn(() => ({ single: mockSingle }));
  const mockInsert = jest.fn(() => ({ select: mockSelect }));
  const mockFrom = jest.fn(() => ({ insert: mockInsert }));

  return {
    supabaseServer: { from: mockFrom },
    // 테스트에서 접근할 수 있도록 노출
    __mocks: { mockSingle, mockInsert, mockFrom },
  };
});

import { POST } from "../route";

function getMocks() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/shared/api/supabase-server").__mocks as {
    mockSingle: jest.Mock;
    mockInsert: jest.Mock;
    mockFrom: jest.Mock;
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

function makeRequest(body: object) {
  return new Request("http://localhost/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/items - 새 PRICE_UNITS 가격값 처리", () => {
  const NEW_PRICE_CASES = [
    { label: "오천원", price: 5_000 },
    { label: "오만원", price: 50_000 },
    { label: "오십만원", price: 500_000 },
    { label: "오백만원", price: 5_000_000 },
  ];

  test.each(NEW_PRICE_CASES)(
    "$label($price) 가격으로 POST 요청 시 200 응답과 item_id를 반환한다",
    async ({ price }) => {
      const { mockSingle, mockInsert, mockFrom } = getMocks();
      mockSingle.mockResolvedValue({ data: { id: 999 }, error: null });
      mockInsert.mockReturnValue({ select: jest.fn(() => ({ single: mockSingle })) });
      mockFrom.mockReturnValue({ insert: mockInsert });

      const res = await POST(makeRequest({ item_name: "테스트아이템", price }));
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.item_id).toBe(999);
    }
  );

  test.each(NEW_PRICE_CASES)(
    "$label($price) 가격이 supabase insert 호출에 그대로 전달된다",
    async ({ price }) => {
      const { mockSingle, mockInsert, mockFrom } = getMocks();
      mockSingle.mockResolvedValue({ data: { id: 1 }, error: null });
      mockInsert.mockReturnValue({ select: jest.fn(() => ({ single: mockSingle })) });
      mockFrom.mockReturnValue({ insert: mockInsert });

      await POST(makeRequest({ item_name: "테스트아이템", price }));

      // insert({item_name, price}) 가 올바른 price 값으로 호출됐는지 확인
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({ item_name: "테스트아이템", price })
      );
    }
  );

  test("price가 없을 때 400 에러를 반환한다", async () => {
    const res = await POST(makeRequest({ item_name: "테스트아이템" }));
    expect(res.status).toBe(400);
  });

  test("item_name이 없을 때 400 에러를 반환한다", async () => {
    const res = await POST(makeRequest({ price: 5_000 }));
    expect(res.status).toBe(400);
  });

  test("DB 에러 발생 시 500 에러를 반환한다", async () => {
    const { mockSingle, mockInsert, mockFrom } = getMocks();
    mockSingle.mockResolvedValue({ data: null, error: { message: "DB 오류" } });
    mockInsert.mockReturnValue({ select: jest.fn(() => ({ single: mockSingle })) });
    mockFrom.mockReturnValue({ insert: mockInsert });

    const res = await POST(makeRequest({ item_name: "테스트아이템", price: 50_000 }));
    expect(res.status).toBe(500);
  });
});
