import getRotationItems from "@/features/items/model/getRotationItems";
import SectionTitle from "@/shared/ui/SectionTitle";
import NewItemsClient from "@/features/items/ui/NewItemsClient";
import { notFound } from "next/navigation";
import ButtonToBack from "@/shared/ui/LinkButton/ButtonToBack";

export default async function RotationItemsPage({
  params,
}: {
  params: Promise<{
    type: string;
  }>;
}) {
  const { type } = await params;

  // type 검증
  if (type !== "new" && type !== "last") {
    notFound();
  }

  const now = new Date();
  let targetDate: Date;

  if (type === "new") {
    // 이번 달
    targetDate = now;
  } else {
    // 지난 달
    targetDate = new Date(now);
    targetDate.setMonth(now.getMonth() - 1);
  }

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const dateFormat = `${year}-${String(month).padStart(2, "0")}`;

  const [maleGatcha, femaleGatcha, maleMagic, femaleMagic] = await Promise.all([
    getRotationItems({
      dateFormat,
      nextYear,
      nextMonth,
      gender: "남",
      source: "뽑기",
    }),
    getRotationItems({
      dateFormat,
      nextYear,
      nextMonth,
      gender: "여",
      source: "뽑기",
    }),
    getRotationItems({
      dateFormat,
      nextYear,
      nextMonth,
      gender: "남",
      source: "요술상자",
    }),
    getRotationItems({
      dateFormat,
      nextYear,
      nextMonth,
      gender: "여",
      source: "요술상자",
    }),
  ]);

  return (
    <section className="lg:max-w-5xl lg:mx-auto lg:px-0 px-4">
      <ButtonToBack />

      <SectionTitle>
        ✨{" "}
        <b className="text-blue-600">
          {year}년 {month}월
        </b>{" "}
        로테이션 아이템
      </SectionTitle>

      <NewItemsClient
        maleGatchaItems={maleGatcha}
        femaleGatchaItems={femaleGatcha}
        maleMagicItems={maleMagic}
        femaleMagicItems={femaleMagic}
      />
    </section>
  );
}
