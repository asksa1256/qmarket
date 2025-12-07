import getNewRotationItems from "@/features/items/model/getNewRotationItems";
import SectionTitle from "@/shared/ui/SectionTitle";
import NewItemsClient from "@/features/items/ui/NewItemsClient";

export default async function NewItems() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const dateFormat = `${year}-${String(month).padStart(2, "0")}`;

  const [maleGatcha, femaleGatcha, maleMagic, femaleMagic] = await Promise.all([
    getNewRotationItems({
      dateFormat,
      nextYear,
      nextMonth,
      gender: "남",
      source: "뽑기",
    }),
    getNewRotationItems({
      dateFormat,
      nextYear,
      nextMonth,
      gender: "여",
      source: "뽑기",
    }),
    getNewRotationItems({
      dateFormat,
      nextYear,
      nextMonth,
      gender: "남",
      source: "요술상자",
    }),
    getNewRotationItems({
      dateFormat,
      nextYear,
      nextMonth,
      gender: "여",
      source: "요술상자",
    }),
  ]);

  return (
    <section className="lg:max-w-5xl lg:mx-auto lg:px-0 px-4">
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
