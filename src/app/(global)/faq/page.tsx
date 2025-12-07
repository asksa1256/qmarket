import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import LinkToOpenInquiryModal from "@/features/inquiry/ui/LinkToOpenInquiryModal";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";
import SectionTitle from "@/shared/ui/SectionTitle";

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <ButtonToMain className="mb-12" />

      <SectionTitle className="text-center">자주 묻는 질문 (FAQ)</SectionTitle>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="faq-2" className="border-b">
          <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4 text-gray-700">
            구매/판매 시 동일한 아이템을 여러 개 등록하고 싶어요.
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 p-4 bg-gray-50 border-t">
            <div className="leading-relaxed">
              - 동일 아이템을 2개 이상 구매하는 경우가 드물고,
              <br />
              - 동일 아이템을 한번에 여러 개 구매/판매 처리할 경우 시세 조작의
              가능성도 있어서
              <br /> 한 번에 1개의 아이템만 거래 완료 처리하도록 했습니다.
              <br /> 만약 확성기처럼 최소 10개 이상의 아이템을 한번에 거래해야
              할 경우, 거래 메시지에 관련 내용을 작성해주세요.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-3" className="border-b">
          <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4 text-gray-700">
            큐플레이의 모든 아이템 정보가 등록되나요?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 p-4 bg-gray-50 border-t">
            <div className="leading-relaxed">
              구매/판매 시 아직 데이터베이스에 등록되지 않은 아이템도 올릴 수는
              있지만, 인게임에 없는 허위 아이템을 올릴 경우 제재 대상이 될 수
              있습니다.
              <br />
              아이템 상세 정보의 경우 뽑기/요술상자 아이템처럼 특정 기간 내에
              한정 판매되는 아이템 위주로 등록중이며, 인게임 상점에서 상시
              판매되는 아이템은 제외하고 있습니다.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-1" className="border-b">
          <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4 text-gray-700">
            아이템 시세는 믿을 수 있는 데이터인가요?
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 p-4 bg-gray-50 border-t">
            <div className="leading-relaxed">
              시세 정보는 참고용으로만 제공되고 있습니다. 보다 정확한 데이터가
              필요하신 경우 &apos;큐플레이 아카이브&apos; 디스코드 채널 또는
              별도 커뮤니티에서 추가로 확인해보시는 것을 권장드립니다.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="mt-10 text-center text-sm text-gray-500">
        이외 궁금하신 점이 있으신가요? <LinkToOpenInquiryModal />
      </p>
    </div>
  );
}
