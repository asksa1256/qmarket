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
        <AccordionItem value="patch-2026-01-08" className="border-b">
          <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4 text-gray-700">
            2026.01.08. 업데이트 안내
          </AccordionTrigger>
          <AccordionContent className="text-foreground p-4 bg-gray-50 border-t break-keep">
            <h4 className="font-bold text-xl mb-4">📢 시세 변동 리포트 추가</h4>
            <p className="leading-relaxed">
              [시세 변동 내역] 섹션 및 페이지가 추가되었습니다. <br />
              해당 섹션에서 매주 아이템별 시세 변동 내역을 확인하실 수 있습니다.
            </p>

            <br />

            <h5 className="text-lg font-bold">
              1️⃣ 메인 - 시세 변동 내역 섹션 추가
            </h5>
            <img
              src="/images/patch-price-changes-1.png"
              alt="메인 페이지 시세 변동 내역 섹션 미리보기"
              className="object-contain my-4"
            />
            <p className="leading-relaxed">
              - 메인 페이지에 주간 시세 변동 내역 일부가 표시됩니다.
              <br />- 로그인 후 시세 변동 내역 페이지로 이동 시 전체 내역을
              확인하실 수 있습니다.
            </p>

            <br />

            <h5 className="text-lg font-bold">2️⃣ 시세 변동 내역 페이지 추가</h5>
            <img
              src="/images/patch-price-changes-2.png"
              alt="시세 변동 내역 페이지 미리보기"
              className="object-contain my-4"
            />
            <p className="leading-relaxed">
              - 시세 변동 내역 페이지에서는 전체 시세 변동 내역 및 요약 정보를
              확인하실 수 있습니다.{" "}
              <span className="text-foreground/50">
                (큐마켓 등록 데이터 기반)
              </span>
              <br />- 아이템별 시세 변동률, 이전 시세, 현재 시세 정보 등의 상세
              내용이 제공됩니다.
            </p>

            <br />

            <img
              src="/images/patch-price-changes-3.png"
              alt="시세 변동 요약 미리보기"
              className="object-contain my-4"
            />
            <p className="leading-relaxed">
              - 페이지 하단에는 주간 시세 변동 요약 정보가 제공됩니다.
            </p>

            <br />
            <br />

            <p className="leading-relaxed">
              시세 변동 내역은 큐마켓에 등록된 거래 데이터를 기반으로 산출되며,
              인게임과 직접적으로 연결되어 있지 않으므로 참고용으로 활용해주시기
              바랍니다.
            </p>

            <br />

            <p className="leading-relaxed mt-4">감사합니다.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="patch-2025-12-12" className="border-b">
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
              - 거래 인증 이미지 등록 후 <b>&apos;완료하기&apos;</b> 버튼을
              눌러주시면 구매/판매 완료 처리가 됩니다.
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
    </div>
  );
}
