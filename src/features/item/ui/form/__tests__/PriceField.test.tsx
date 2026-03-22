/**
 * PriceField 컴포넌트 테스트
 *
 * 오천원(5,000), 오만원(50,000), 오십만원(500,000), 오백만원(5,000,000) 단위 버튼이
 * 폼 값을 올바르게 누적시키는지 검증합니다.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PriceField from "../PriceField";
import { ItemFormSchema, ItemFormType } from "../../../model/schema";

// PriceField를 실제 react-hook-form 폼에 연결하는 래퍼 컴포넌트
function PriceFieldWrapper({ onSubmit }: { onSubmit: (v: ItemFormType) => void }) {
  const form = useForm<ItemFormType>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      item_name: "테스트아이템",
      price: 0,
      is_sold: false,
      item_source: "gatcha",
      item_gender: "m",
      category: "hair",
      image: null,
      message: "테스트 메시지",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <PriceField form={form} />
      <button type="submit">제출</button>
    </form>
  );
}

describe("PriceField - 새 단위 버튼 동작", () => {
  const NEW_UNITS = [
    { label: "+ 오천원", amount: 5_000 },
    { label: "+ 오만원", amount: 50_000 },
    { label: "+ 오십만원", amount: 500_000 },
    { label: "+ 오백만원", amount: 5_000_000 },
  ];

  test.each(NEW_UNITS)(
    "$label 버튼이 렌더링된다",
    async ({ label }) => {
      render(<PriceFieldWrapper onSubmit={jest.fn()} />);
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  );

  test.each(NEW_UNITS)(
    "$label 버튼 클릭 시 input 값이 $amount 로 증가한다",
    async ({ label, amount }) => {
      render(<PriceFieldWrapper onSubmit={jest.fn()} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: label }));

      const input = screen.getByPlaceholderText("가격");
      expect(input).toHaveValue(amount.toLocaleString());
    }
  );

  test("오천원 버튼을 3번 클릭하면 15,000이 된다", async () => {
    render(<PriceFieldWrapper onSubmit={jest.fn()} />);
    const user = userEvent.setup();

    const btn = screen.getByRole("button", { name: "+ 오천원" });
    await user.click(btn);
    await user.click(btn);
    await user.click(btn);

    expect(screen.getByPlaceholderText("가격")).toHaveValue("15,000");
  });

  test("오만원 + 오천원 혼합 클릭 시 올바르게 합산된다", async () => {
    render(<PriceFieldWrapper onSubmit={jest.fn()} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "+ 오만원" }));
    await user.click(screen.getByRole("button", { name: "+ 오천원" }));

    // 50,000 + 5,000 = 55,000
    expect(screen.getByPlaceholderText("가격")).toHaveValue("55,000");
  });

  test("폼 제출 시 오백만원 버튼으로 입력된 price 값이 서버 액션에 그대로 전달된다", async () => {
    const handleSubmit = jest.fn();
    render(<PriceFieldWrapper onSubmit={handleSubmit} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "+ 오백만원" }));
    await user.click(screen.getByRole("button", { name: "제출" }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ price: 5_000_000 }),
      expect.anything()
    );
  });

  test("폼 제출 시 오십만원 + 오만원 합산 price 값이 서버 액션에 전달된다", async () => {
    const handleSubmit = jest.fn();
    render(<PriceFieldWrapper onSubmit={handleSubmit} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "+ 오십만원" }));
    await user.click(screen.getByRole("button", { name: "+ 오만원" }));
    await user.click(screen.getByRole("button", { name: "제출" }));

    // 500,000 + 50,000 = 550,000
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ price: 550_000 }),
      expect.anything()
    );
  });
});
