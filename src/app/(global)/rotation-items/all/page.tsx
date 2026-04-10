import getRotationItems from "@/features/items/model/getRotationItems";
import getRotationMonths from "@/features/items/model/getRotationMonths";
import AllRotationClient from "@/features/items/ui/AllRotationClient";
import SectionTitle from "@/shared/ui/SectionTitle";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전체 로테이션 아이템",
  description: "큐플레이 월별 전체 로테이션 뽑기·요술상자 아이템 목록",
};

type PageProps = {
  searchParams: Promise<{ month?: string }>;
};

export default async function AllRotationPage({ searchParams }: PageProps) {
  const { month } = await searchParams;

  const { data: months } = await getRotationMonths();

  const selectedMonth = month && months.includes(month) ? month : months[0];

  if (!selectedMonth) {
    return (
      <section className="lg:max-w-6xl lg:mx-auto lg:px-0 px-4">
        <ButtonToBack />
        <SectionTitle>✨ 전체 로테이션 아이템</SectionTitle>
        <p className="text-muted-foreground">등록된 로테이션 아이템이 없습니다.</p>
      </section>
    );
  }

  const [yearStr, monthStr] = selectedMonth.split("-");
  const year = parseInt(yearStr);
  const monthNum = parseInt(monthStr);
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? year + 1 : year;

  const [maleGatcha, femaleGatcha, maleMagic, femaleMagic] = await Promise.all([
    getRotationItems({
      dateFormat: selectedMonth,
      nextYear,
      nextMonth,
      gender: "남",
      source: "뽑기",
    }),
    getRotationItems({
      dateFormat: selectedMonth,
      nextYear,
      nextMonth,
      gender: "여",
      source: "뽑기",
    }),
    getRotationItems({
      dateFormat: selectedMonth,
      nextYear,
      nextMonth,
      gender: "남",
      source: "요술상자",
    }),
    getRotationItems({
      dateFormat: selectedMonth,
      nextYear,
      nextMonth,
      gender: "여",
      source: "요술상자",
    }),
  ]);

  return (
    <section className="lg:max-w-6xl lg:mx-auto lg:px-0 px-4">
      <ButtonToBack />

      <SectionTitle>
        ✨{" "}
        <b className="text-blue-600">
          {year}년 {monthNum}월
        </b>{" "}
        로테이션 아이템
      </SectionTitle>

      <AllRotationClient
        months={months}
        selectedMonth={selectedMonth}
        maleGatchaItems={maleGatcha}
        femaleGatchaItems={femaleGatcha}
        maleMagicItems={maleMagic}
        femaleMagicItems={femaleMagic}
      />
    </section>
  );
}
