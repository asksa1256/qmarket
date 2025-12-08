export default function TermsOfUseContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">이용 약관</h1>
      <p className="text-sm text-gray-600 mb-8 pb-6 border-b-2 border-gray-200">
        <strong>최종 수정일:</strong> 2025년 12월 08일
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        1. 서비스 소개
      </h2>
      <p className="text-gray-700 mb-4">
        본 서비스는 개인 개발자가 운영하는 게임 아이템 거래 정보 공유
        플랫폼입니다. 사용자 간 아이템 판매/구매 요청을 등록하고 시세, 아이템
        상세 정보, 거래 내역 등을 확인할 수 있는 커뮤니티 서비스를 제공합니다.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        2. 서비스의 성격 및 면책
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>
          본 서비스는 비영리 사이드 프로젝트로 운영되며, 거래를 직접 중개하거나
          보증하지 않습니다.
        </li>
        <li>사용자 간 거래는 전적으로 당사자 간 책임 하에 이루어집니다.</li>
        <li>운영자는 서버 장애, 데이터 손실 등에 대해 책임지지 않습니다.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        3. 회원 가입 및 계정
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>회원 가입은 Discord 계정 연동을 통해 이루어집니다.</li>
        <li>한 사람이 여러 계정을 만들어 악용하는 행위는 금지됩니다.</li>
        <li>회원 탈퇴: [디스코드 설정] - [승인한 앱] - [승인 해제하기]</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        4. 금지 행위
      </h2>
      <p className="text-gray-700 mb-3">
        다음 행위는 금지되며, 위반 시 사전 통보 없이 계정이 정지될 수 있습니다.
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>사기, 허위 매물 등록</li>
        <li>불법 복제, 해킹으로 취득한 아이템 거래</li>
        <li>현금 거래 유도 (게임사 약관 위반)</li>
        <li>욕설, 비방, 혐오 발언</li>
        <li>스팸, 광고 도배</li>
        <li>서비스 운영 방해 행위</li>
        <li>기타 법령 위반 행위</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        5. 게시물
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>게시물에 대한 권리와 책임은 작성자에게 있습니다.</li>
        <li>운영자는 부적절한 게시물을 사전 통지 없이 삭제할 수 있습니다.</li>
        <li>게시물은 서비스 종료 시 함께 삭제됩니다.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        6. 서비스 이용
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>서비스는 무료로 제공되며, 향후 정책 변경 가능성이 있습니다.</li>
        <li>
          운영자는 서비스 개선을 위해 기능을 추가하거나 변경할 수 있습니다.
        </li>
        <li>중요한 정책 변경 사항은 서비스 내 공지로 안내합니다.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        7. 분쟁 해결
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>사용자 간 분쟁은 당사자 간 해결을 원칙으로 합니다.</li>
        <li>운영자는 분쟁 해결을 위한 중재나 조정을 제공하지 않습니다.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        8. 기타
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.</li>
        <li>
          본 약관은 필요에 따라 수정될 수 있으며, 중요 변경 사항은 공지합니다.
        </li>
      </ul>
    </div>
  );
}
