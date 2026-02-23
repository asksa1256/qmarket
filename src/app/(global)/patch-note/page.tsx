import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import ButtonToMain from "@/shared/ui/LinkButton/ButtonToMain";
import SectionTitle from "@/shared/ui/SectionTitle";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "패치노트",
  description: "큐마켓 업데이트 내역 및 패치노트. 새로운 기능과 변경 사항을 확인하세요.",
};

export default function PatchNotePage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <ButtonToMain className="mb-12" />

      <SectionTitle className="text-center">패치노트</SectionTitle>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="patch-2026-02-23" className="border-b">
          <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4 text-gray-700">
            2026.02.23. 업데이트 안내
          </AccordionTrigger>

          <AccordionContent className="text-foreground p-4 bg-gray-50 border-t break-keep">
            <h4 className="font-bold text-xl mb-2">📢 아이템 상세 페이지 댓글 시스템 추가</h4>

            <p className="leading-relaxed">
              아이템 상세 페이지 하단에 <strong>댓글 영역</strong>이 추가되었습니다.
            </p>

            <details className="mt-6">
              <summary className="cursor-pointer font-semibold text-gray-700">
                자세히 보기
              </summary>
              <div className="mt-4">
                <ul className="list-disc list-inside mt-4 text-foreground/80 leading-relaxed">
                  <li>로그인 후, 아이템에 대한 댓글과 답글을 등록할 수 있습니다.</li>
                  <li>부적절한 댓글은 해당 댓글의 <strong>신고</strong>버튼을 눌러 제보해주세요.</li>
                </ul>
                <Image
                  src="/images/patch-item-comment-1.png"
                  alt="아이템 상세 페이지 댓글 시스템 미리보기"
                  width={600}
                  height={400}
                  className="object-contain my-4"
                />
              </div>
            </details>

            <p className="leading-relaxed mt-6">
              감사합니다.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="patch-2026-01-08" className="border-b">
          <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-4 text-gray-700">
            2026.01.08. 업데이트 안내
          </AccordionTrigger>

          <AccordionContent className="text-foreground p-4 bg-gray-50 border-t break-keep">
            <h4 className="font-bold text-xl mb-2">📢 시세 변동 리포트 추가</h4>

            <p className="leading-relaxed">
              아이템별 <strong>주간 시세 변동 내역</strong>을 확인할 수 있는
              기능이 추가되었습니다.
            </p>

            <p className="text-sm text-foreground/60 mt-1">
              거래 타이밍 판단을 돕기 위해, 최근 거래 데이터를 주간 단위로
              집계한 시세 변동 정보를 제공합니다.
            </p>

            <details className="mt-6">
              <summary className="cursor-pointer font-semibold text-gray-700">
                자세히 보기
              </summary>

              <div className="mt-4">
                <h5 className="text-lg font-bold">
                  1️⃣ 메인 - 시세 변동 내역 섹션 추가
                </h5>

                <Image
                  src="/images/patch-price-changes-1.png"
                  alt="메인 페이지 시세 변동 내역 섹션 미리보기"
                  width={600}
                  height={400}
                  className="object-contain my-4"
                />

                <p className="leading-relaxed">
                  - 메인 페이지에서 주간 시세 변동 내역 일부를 확인할 수
                  있습니다.
                  <br />- 로그인 후 시세 변동 내역 페이지로 이동하면 전체 내역을
                  확인할 수 있습니다.
                </p>

                <br />

                <h5 className="text-lg font-bold">
                  2️⃣ 시세 변동 내역 페이지 추가
                </h5>

                <Image
                  src="/images/patch-price-changes-2.png"
                  alt="시세 변동 내역 페이지 미리보기"
                  width={600}
                  height={400}
                  className="object-contain my-4"
                />

                <p className="leading-relaxed">
                  - 전체 시세 변동 내역과 요약 정보를 제공합니다.{" "}
                  <span className="text-foreground/50">
                    (사이트 등록 거래 데이터 기준)
                  </span>
                  <br />- 아이템별 시세 변동률, 이전 시세, 현재 시세 정보를
                  확인할 수 있습니다.
                </p>

                <Image
                  src="/images/patch-price-changes-3.png"
                  alt="시세 변동 요약 미리보기"
                  width={600}
                  height={400}
                  className="object-contain my-4"
                />

                <p className="leading-relaxed">
                  - 페이지 하단에서 주간 시세 변동 요약 정보를 확인할 수
                  있습니다.
                </p>

                <p className="leading-relaxed text-sm text-foreground/60 mt-6">
                  시세 변동 내역은 사이트에 등록된 거래 데이터를 기반으로
                  산출되며, 인게임과 직접적으로 연동되지 않은 데이터이므로
                  참고용으로 활용해주시기 바랍니다.
                </p>

                <p className="leading-relaxed mt-6">감사합니다.</p>
              </div>
            </details>
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
            <Image
              src="/images/patch-1-1.jpg"
              alt="거래 완료 모달 - 인증샷 첨부 필드"
              width={600}
              height={400}
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
            <Image
              src="/images/patch-1-2.jpg"
              alt="인증샷 확인 화면"
              width={600}
              height={400}
              className="object-contain my-4"
            />
            <p className="leading-relaxed">
              - 유저 프로필에 인증 횟수와 거래 완료 횟수가 모두 표시됩니다.
            </p>
            <Image
              src="/images/patch-1-3.png"
              alt="유저 프로필 - 거래 인증/완료 횟수"
              width={600}
              height={400}
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
