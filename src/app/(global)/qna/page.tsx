import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";

export type QnADocument = {
  id: string;
  question: string;
  answer: string;
};

export const QNA_DATA: QnADocument[] = [
  {
    id: "item-1",
    question: "Next.js에서 shadcn/ui를 사용하는 이유는 무엇인가요?",
    answer:
      "shadcn/ui는 컴포넌트가 npm 패키지 대신 프로젝트 소스 코드에 직접 추가되어 높은 커스터마이징 유연성을 제공합니다. 또한 Tailwind CSS를 기반으로 설계되어 Next.js의 스타일링 환경과 잘 통합됩니다.",
  },
  {
    id: "item-2",
    question: "Tailwind CSS의 장점은 무엇인가요?",
    answer:
      "Tailwind CSS는 유틸리티 우선(utility-first) CSS 프레임워크로, 미리 정의된 클래스들을 조합하여 스타일을 빠르게 적용할 수 있습니다. 이는 스타일 충돌을 줄이고 개발 속도를 향상시킵니다.",
  },
  {
    id: "item-3",
    question: "Accordion 컴포넌트의 역할은 무엇인가요?",
    answer:
      "Accordion 컴포넌트는 콘텐츠 목록을 수직적으로 쌓고, 헤더를 클릭할 때 관련 패널을 펼치거나 접을 수 있도록 합니다. 이는 특히 FAQ(자주 묻는 질문)와 같은 많은 양의 정보를 효율적으로 보여줄 때 유용합니다.",
  },
];

export default function QnAPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        자주 묻는 질문 (FAQ)
      </h1>

      <Accordion type="single" collapsible className="w-full">
        {QNA_DATA.map((item: QnADocument) => (
          <AccordionItem key={item.id} value={item.id} className="border-b">
            <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4">
              {item.question}
            </AccordionTrigger>

            <AccordionContent className="text-gray-600 p-4 bg-gray-50 border-t">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-10 text-center text-sm text-gray-500">
        찾으시는 질문이 없으신가요?{" "}
        <Button variant="link" className="px-0 hover:text-blue-600">
          문의하기
        </Button>
      </p>
    </div>
  );
}
