import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import LinkToOpenInquiryModal from "@/features/inquiry/ui/LinkToOpenInquiryModal";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <ButtonToMain className="mb-12" />

      <h1 className="text-2xl font-bold mb-16 text-center text-gray-800">
        자주 묻는 질문 (FAQ)
      </h1>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="faq-1" className="border-b">
          <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4 text-gray-700">
            시세는 어떻게 계산되나요?
          </AccordionTrigger>

          <AccordionContent className="text-gray-600 p-4 bg-gray-50 border-t">
            <p className="leading-relaxed">
              시세는 <b>다수의 거래 내역 데이터</b>를 기반으로 계산되며,
              일반적인 평균값은 아닙니다.
              <br />
              또한 <b>비정상적인 거래 가격은 시세에 반영되지 않도록</b> 설계되어
              있습니다.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-2" className="border-b">
          <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4 text-gray-700">
            판매자가 직접 &apos;판매 완료&apos;로 수정하는데, 시세 조작 방지가
            가능한가요?
          </AccordionTrigger>

          <AccordionContent className="text-gray-600 p-4 bg-gray-50 border-t">
            <div className="leading-relaxed">
              판매자가 실제로 거래하지 않고 낮은 가격이나 높은 가격으로 임의의
              거래를 등록할 수는 있지만, 이는{" "}
              <b>시세에 반영되지 않거나 매우 제한적인 영향</b>을 미칩니다.
              <br />
              시세를 조작하려면 매우 많은 수의 허위 거래를 지속적으로 등록해야
              하는데, 이 경우 로그에 거래 내역이 모두 남기 때문에{" "}
              <div className="space-y-2 pl-4 border-l-2 mt-2 py-1">
                <div className="flex items-start">
                  <span className="text-sm font-bold mr-2">•</span>
                  <p className="font-bold">계정이 제재되며,</p>
                </div>

                <div className="flex items-start">
                  <span className="text-sm font-bold mr-2">•</span>
                  <p className="font-bold">조작 내역은 삭제되고,</p>
                </div>

                <div className="flex items-start">
                  <span className="text-sm font-bold mr-2">•</span>
                  <p className="font-bold">
                    아이템 시세는 원래대로 복원됩니다.
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="mt-10 text-center text-sm text-gray-500">
        찾는 질문이 없으신가요? <LinkToOpenInquiryModal />
      </p>
    </div>
  );
}
