import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import LinkToOpenInquiryModal from "@/features/inquiry/ui/LinkToOpenInquiryModal";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";
import SectionTitle from "@/shared/ui/SectionTitle";

export default function PatchNotePage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <ButtonToMain className="mb-12" />

      <SectionTitle className="text-center">패치노트</SectionTitle>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="patch-1" className="border-b">
          <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4 text-gray-700">
            2025.12.12. 업데이트 안내
          </AccordionTrigger>
          <AccordionContent className="text-foreground p-4 bg-gray-50 border-t break-keep">
            <h4 className="font-bold text-xl mb-4">
              📢 거래 완료 인증 이미지 첨부 기능 추가
            </h4>
            <p className="leading-relaxed">
              - 이제 구매/판매 완료 시 거래 인증샷을 첨부하실 수 있습니다.
            </p>
            <img
              src="/images/patch-1-1.jpg"
              alt="거래 완료 모달 - 인증샷 첨부 필드"
              className="object-contain my-4"
            />
            <p className="leading-relaxed">
              - 거래 인증 이미지 등록 후, '완료하기' 버튼을 눌러주시면 구매/판매
              완료 처리가 됩니다.
            </p>
            <p className="leading-relaxed">
              - 등록하신 인증샷은 거래 완료 아이템의 메시지 툴팁에서 확인하실 수
              있습니다. (모든 유저가 확인 가능)
            </p>
            <img
              src="/images/patch-1-2.jpg"
              alt="인증샷 확인 화면"
              className="object-contain my-4"
            />
            <p className="leading-relaxed">
              - 유저 프로필에 인증 횟수와 거래 완료 횟수가 모두 표시됩니다.
            </p>
            <img
              src="/images/patch-1-3.png"
              alt="유저 프로필 - 거래 인증/완료 횟수"
              className="object-contain my-4"
            />
            <p className="leading-relaxed">
              거래 완료 시 인증샷을 첨부하면 거래자 및 데이터의 신뢰도가
              상승하므로, 해당 기능을 가급적 활용해주시는 것을 권장드립니다.
            </p>

            <p className="leading-relaxed mt-4">감사합니다.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="mt-10 text-center text-sm text-gray-500">
        이외 궁금하신 점이 있으신가요? <LinkToOpenInquiryModal />
      </p>
    </div>
  );
}
